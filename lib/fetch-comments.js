const Either = require('data.either')
const Task = require('data.task')

const fetchFirstPageToken = require('./fetch-first-page-token')
const fetchCommentPage = require('./fetch-comment-page')
const tokenizeComments = require('./tokenize-comments')
const parseCommentThread = require('./parse-comment-thread')
const fetchReplies = require('./fetch-replies')

const parseComments = $commentThread =>
  parseCommentThread($commentThread)
    .fold(Task.rejected, Task.of)

const fetchCommentReplies = (videoId, comment) =>
  fetchReplies(videoId, comment)
    .map(replies => Object.assign({}, comment, {
      hasReplies: true,
      numReplies: replies.length,
      replies
    }))

const addReplies = (videoId, comment) =>
  (comment.hasReplies && !comment.replies)
    ? fetchCommentReplies(videoId, comment)
    : Task.of(comment)

const fetchComments = (videoId, pageToken) =>
  Either.fromNullable(pageToken)
    .leftMap(_ => fetchFirstPageToken(videoId))
    .map(t => Task.of(t))
    .merge()
    .chain(t => fetchCommentPage(videoId, t))
    .chain(({ commentHtml, nextPageToken }) =>
      tokenizeComments(commentHtml)                           // Either(List($comment))
        .chain(cs => cs.traverse(Task.of, parseComments))                   // List(Task(comment))
        .chain(cs => cs.traverse(Task.of, c => addReplies(videoId, c)))       // Task(List(commentWithReplies))
        .map(cs => ({ comments: cs.toJS(), nextPageToken: nextPageToken})))

module.exports = fetchComments
