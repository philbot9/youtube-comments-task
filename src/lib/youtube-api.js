import { buildWatchFragmentsUrl, buildCommentServiceUrl } from './url-builder'
import buildRequestFormData from './build-request-form-data'

export function fetchCommentsWatchFragment (videoId, session, request) {
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

export function fetchCommentPage (pageToken, session, request) {
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
