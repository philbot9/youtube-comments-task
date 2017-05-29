const Task = require('data.task')
const Either = require('data.either')
const debug = require('debug')('fetch-replies')

const { commentReplies } = require('./youtube-api/youtube-api')
const { cheerio } = require('./utils/cheerio-utils')
const parseReplies = require('./parse-replies')
const { scraperError } = require('./error-handler')

const getRepliesToken = comment =>
  Either.fromNullable(comment.repliesToken)
    .leftMap(e => 'Comment parameter object does not have a repliesToken field')
    .fold(Task.rejected, Task.of)

const getContentHtml = r =>
  Either.fromNullable(r.content_html)
    .leftMap(
      _ => 'Invalid Replies-API response, does not contain content_html field'
    )
    .fold(Task.rejected, Task.of)

const parseCommentReplies = $replies =>
  parseReplies($replies)
    .orElse(e => {
      debug('Unable to parse comment replies: %s', e)
      return Either.of([])
    })
    .fold(Task.rejected, Task.of)

const fetchReplies = (videoId, comment) =>
  getRepliesToken(comment)
    .chain(repliesToken => commentReplies(videoId, repliesToken))
    .chain(getContentHtml)
    .map(html => cheerio(`<div>${html}</div>`))
    .chain(parseCommentReplies)
    .rejectedMap(
      e =>
        e.type
          ? e
          : scraperError({
              videoId,
              message: e,
              component: 'fetch-replies',
              operation: 'fetch-replies'
            })
    )

module.exports = fetchReplies
