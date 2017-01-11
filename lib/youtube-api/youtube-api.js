const request = require('../utils/request')
const getSession = require('./session-store')
const retry = require('../utils/retry-task')
const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('./url-builder')

// TODO: make # retries configurable
const withRetries = retry(3)

const requestWithRetries = arg =>
  withRetries(() => request(arg))

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
        buildCommentServiceUrl('action_get_comments'),
        buildRequestForm(sess, pageToken)))
    .chain(requestWithRetries)

const commentReplies = (videoId, repliesToken) =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildCommentServiceUrl('action_get_comment_replies'),
        buildRequestForm(sess, repliesToken)
      ))
    .chain(requestWithRetries)

const commentsWatchFragment = videoId =>
  getSession(videoId)
    .map(sess =>
      buildJsonPostRequest(
        buildWatchFragmentsUrl(videoId, sess, ['comments']),
        buildRequestForm(sess)))
    .chain(requestWithRetries)

// https:// www.youtube.com/comment_service_ajax?action_get_comment_replies=1

module.exports = { commentPage, commentReplies, commentsWatchFragment }
