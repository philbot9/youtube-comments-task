const Task = require('data.task')
const Either = require('data.either')

const { commentReplies } = require('./youtube-api/youtube-api')
const { cheerio } = require('./utils/cheerio-utils')
const parseReplies = require('./parse-replies')

const getRepliesToken = comment =>
  Either.fromNullable(comment.repliesToken)
    .leftMap(e => 'Comment parameter object does not have a repliesToken field')
    .fold(Task.rejected, Task.of)

const getContentHtml = r =>
  Either.fromNullable(r.content_html)
    .leftMap(_ => 'Invalid Replies-API response, does not contain content_html field')
    .fold(Task.rejected, Task.of)

const parseCommentReplies = $replies =>
  parseReplies($replies)
    .fold(Task.rejected, Task.of)

const fetchReplies = (videoId, comment) =>
  getRepliesToken(comment)
    .chain(repliesToken => commentReplies(videoId, repliesToken))
    .chain(getContentHtml)
    .map(html => cheerio(`<div>${html}</div>`))
    .chain(parseCommentReplies)

module.exports = fetchReplies
