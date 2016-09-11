import Debug from 'debug'
const debug = Debug('fetch-comment-page')

import requestImport from './request'
import { buildCommentServiceUrl } from './url-builder'

export default function (videoId, pageToken, getSessionToken, deps = {}) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }
  if (!pageToken) {
    return Promise.reject('Missing second parameter: pageToken')
  }
  if (!getSessionToken) {
    return Promise.reject('Missing third parameter: getSessionToken')
  }

  const { request = requestImport } = deps

  debug('fetching comment page for %s with page token %s', videoId, pageToken)
  return getSessionToken(videoId)
    .then(sessionToken => buildFormData(sessionToken, pageToken))
    .then(formData => fetchPage(formData, request))
}

export function buildFormData (sessionToken, pageToken) {
  if (!sessionToken) {
    throw new Error('Missing first parameter: sessionToken')
  }
  if (!pageToken) {
    throw new Error('Missing second parameter: pageToken')
  }

  return {
    session_token: sessionToken,
    page_token: pageToken
  }
}

export function fetchPage (formData, request) {
  if (!formData) {
    return Promise.reject('Missing first argument: formData')
  }
  if (!request) {
    return Promise.reject('Missing second argument: request')
  }

  const url = buildCommentServiceUrl()
  return request({
    method: 'POST',
    form: formData,
    url,
  })
}
