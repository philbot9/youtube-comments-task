const { Observable } = require('rxjs')

const buildCommentPageStream = require('./comment-page-stream')
const tokenizeComments = require('./tokenize-comments')
const parseCommentThread = require('./parse-comment-thread')
const fetchReplies = require('./fetch-replies')
const observableFromTask = require('./utils/observable-from-task')

const parseComments = $commentThread =>
  parseCommentThread($commentThread)
    .fold(e => { throw new Error(e) },
          c => c)

const fetchCommentReplies = (videoId, comment) =>
  fetchReplies(videoId, comment)
    .map(replies => Object.assign({}, comment, {
      hasReplies: true,
      numReplies: replies.length,
      replies
    }))

const addReplies = (videoId, comment) =>
  (comment.hasReplies && !comment.replies)
    ? Observable.defer(() => observableFromTask(fetchCommentReplies(videoId, comment)))
    : Observable.defer(() => Observable.of(comment))

const buildCommentStream = videoId =>
  buildCommentPageStream(videoId)
    .concatMap(html => Observable.from(tokenizeComments(html)))
    .map(parseComments)
    .concatMap(c => addReplies(videoId, c))

module.exports = buildCommentStream
