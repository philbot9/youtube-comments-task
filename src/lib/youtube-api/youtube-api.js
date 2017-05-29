const { delayedRetry } = require('retry-task')
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

const buildJsonPostRequest = (url, form) => ({
  method: 'POST',
  headers: {
    'accept-language': 'en-US;q=1.0,en;q=0.9'
  },
  json: true,
  url,
  form
})

const commentPage = (videoId, pageToken) =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildCommentServiceUrl('action_get_comments'),
        buildRequestForm(sess, pageToken)
      )
    )
    .chain(requestWithRetries)

const commentReplies = (videoId, repliesToken) =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildCommentServiceUrl('action_get_comment_replies'),
        buildRequestForm(sess, repliesToken)
      )
    )
    .chain(requestWithRetries)

const commentsWatchFragment = videoId =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildWatchFragmentsUrl(videoId, sess, ['comments']),
        buildRequestForm(sess)
      )
    )
    .chain(requestWithRetries)

module.exports = { commentPage, commentReplies, commentsWatchFragment }
