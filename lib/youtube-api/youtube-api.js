const Task = require('data.task')
const request = require('request')

const buildSessionStore = require('./session-store')
const retry = require('../utils/retry-task')
const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('./url-builder')
const buildRequestFormData = require('./build-request-form-data')

const Youtube = (config) => {
  const getSession = buildSessionStore()

  const fetchCommentsWatchFragment = (videoId) => {
    if (!videoId) {
      throw new Error('Missing first parameter: videoId')
    }

    if (!session) {
      throw new Error('Missing second parameter: session')
    }

    if (!request) {
      throw new Error('Missing third parameter: request')
    }

    const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    const form = buildRequestFormData(session)

    return request({
      method: 'POST',
      json: true,
      url,
      form
    })
  }

  function fetchCommentPage (pageToken) {
    if (!pageToken) {
      throw new Error('Missing first parameter: pageToken')
    }

    if (!session) {
      throw new Error('Missing second parameter: session')
    }

    if (!request) {
      throw new Error('Missing third parameter: request')
    }

    const url = buildCommentServiceUrl()
    const form = buildRequestFormData(session, pageToken)

    return request({
      method: 'POST',
      json: true,
      url,
      form
    })
  }
}
