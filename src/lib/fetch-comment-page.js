import requestImport from './request'
import Debug from 'debug'
const debug = Debug('fetch-comment-page')

export const URL_TEMPLATE = 'https://www.youtube.com/comment_ajax?action_load_comments=1&order_by_time=True&filter={{videoId}}'

export default function (params = {}) {
  const { videoId, pageToken, getSessionToken, deps = {} } = params

  if (!videoId) {
    throw new Error('Missing parameter: videoId')
  }

  if (!getSessionToken) {
    throw new Error('Missing parameter: getSessionToken')
  }

  const {
    request = requestImport,
    parseComments
  } = deps

  return getSessionToken(videoId)
    .then(sessionToken => buildFormData({ sessionToken, videoId, pageToken }))
    .then(formData => fetchPage({ request, formData, videoId }))
}

export function buildFormData ({ sessionToken, videoId, pageToken }) {
  if (!pageToken) {
    return {
      session_token: sessionToken,
      video_id: videoId
    }
  } else {
    return {
      session_token: sessionToken,
      page_token: pageToken
    }
  }
}

export function fetchPage ({ request, formData, videoId }) {
  const url = URL_TEMPLATE.replace('{{videoId}}', videoId)
  return request.post(url, formData)
}

export function parsePage (html) {

}
