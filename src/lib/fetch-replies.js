const Task = require('data.task')
const Either = require('data.either')
const debug = require('debug')('fetch-replies')
const { liftM2 } = require('control.monads')

const { commentReplies } = require('./youtube-api/youtube-api')
const { cheerio, cheerioFindAttr } = require('./utils/cheerio-utils')
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

const extractNextRepliesToken = $content =>
  cheerioFindAttr($content, '.load-more-button', 'data-uix-load-more-post-body')
    .map(token => token.replace(/^page_token=/i, ''))
    .map(decodeURIComponent)
    .orElse(() => Either.of(null))
    .fold(Task.rejected, Task.of)

const fetchAllReplies = (videoId, repliesToken) =>
  commentReplies(videoId, repliesToken)
    .chain(getContentHtml)
    .map(html => cheerio(`<div>${html}</div>`))
    .chain($replies =>
      liftM2(
        (replies, nextRepliesToken) => ({ replies, nextRepliesToken }),
        parseCommentReplies($replies),
        extractNextRepliesToken($replies)
      )
    )
    .chain(
      ({ replies, nextRepliesToken }) =>
        (nextRepliesToken
          ? fetchAllReplies(videoId, nextRepliesToken).map(nextReplies =>
              replies.concat(nextReplies)
            )
          : Task.of(replies))
    )

const fetchReplies = (videoId, comment) =>
  getRepliesToken(comment)
    .chain(repliesToken => fetchAllReplies(videoId, repliesToken))
    .rejectedMap(
      e =>
        (e.type
          ? e
          : scraperError({
            videoId,
            message: e,
            component: 'fetch-replies',
            operation: 'fetch-replies'
          }))
    )

module.exports = fetchReplies
