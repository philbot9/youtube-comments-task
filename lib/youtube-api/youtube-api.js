const Task = require('data.task')

const request = require('../utils/request')
const getSession = require('./session-store')
const retry = require('../utils/retry-task')
const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('./url-builder')
const buildRequestFormData = require('./build-request-form-data')

// TODO: make # retries configurable
const withRetry = retry(3)

const requestWithRetry = arg =>
  withRetry(() => request(arg))

const buildJsonPostRequest = url => form => ({
  method: 'POST',
  json: true,
  url,
  form
})

const commentPage = (videoId, pageToken) =>
  getSession(videoId)
    .chain(sess => Task.of(buildJsonPostRequest)
      .ap(Task.of(buildCommentServiceUrl()))
      .ap(Task.of(buildRequestFormData(sess, pageToken))))
    .chain(requestWithRetry)

const commentsWatchFragment = videoId =>
  getSession(videoId)
    .chain(sess => Task.of(buildJsonPostRequest)
      .ap(Task.of(buildWatchFragmentsUrl(videoId, sess, ['comments'])))
      .ap(Task.of(buildRequestFormData(sess))))
    .chain(requestWithRetry)

module.exports = { commentPage, commentsWatchFragment }
