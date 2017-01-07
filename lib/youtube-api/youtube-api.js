const request = require('../utils/request')
const getSession = require('./session-store')
const retry = require('../utils/retry-task')
const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('./url-builder')

// TODO: make # retries configurable
const withRetry = retry(3)

const requestWithRetry = arg =>
  withRetry(() => request(arg))

const buildRequestForm = (session, pageToken) => ({
  session_token: session.sessionToken,
  page_token: pageToken
})

const buildJsonPostRequest = (url, form) => ({
  method: 'POST',
  json: true,
  url,
  form
})

const commentPage = (videoId, pageToken) =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildCommentServiceUrl(),
        buildRequestForm(sess, pageToken)))
    .chain(requestWithRetry)

const commentsWatchFragment = videoId =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildWatchFragmentsUrl(videoId, sess, ['comments']),
        buildRequestForm(sess)))
    .chain(requestWithRetry)

module.exports = { commentPage, commentsWatchFragment }
