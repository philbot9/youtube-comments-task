const { delayedRetry } = require('retry-task')
const Either = require('data.either')
const Task = require('data.task')
const request = require('../utils/request')
const getSession = require('./session-store')
const {
  buildWatchFragmentsUrl,
  buildCommentServiceUrl
} = require('./url-builder')

// TODO: make # retries configurable
const withRetries = delayedRetry(3, n => n * n * 500)

const requestWithRetries = arg => withRetries(() => request(arg))

const buildRequestForm = (session, pageToken) => ({
  session_token: session.sessionToken,
  page_token: pageToken
})

const buildJsonPostRequest = (url, form, session) => ({
  method: 'POST',
  headers: {
    'accept-language': 'en-US;q=1.0,en;q=0.9'
  },
  json: true,
  jar: session.cookieJar,
  url,
  form
})

const getBody = res =>
  Either.fromNullable(res.body)
    .leftMap(_ => 'Invalid response from YouTube. Missing body,')
    .fold(Task.rejected, Task.of)

const commentPage = (videoId, pageToken) =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildCommentServiceUrl('action_get_comments'),
        buildRequestForm(sess, pageToken),
        sess
      )
    )
    .chain(requestWithRetries)
    .chain(getBody)

const commentReplies = (videoId, repliesToken) =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildCommentServiceUrl('action_get_comment_replies'),
        buildRequestForm(sess, repliesToken),
        sess
      )
    )
    .chain(requestWithRetries)
    .chain(getBody)

const commentsWatchFragment = videoId =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildWatchFragmentsUrl(videoId, sess, ['comments']),
        buildRequestForm(sess),
        sess
      )
    )
    .chain(requestWithRetries)
    .chain(getBody)

module.exports = { commentPage, commentReplies, commentsWatchFragment }
