import requestImport from './request'
import { buildWatchFragmentsUrl } from './url-builder'

export default function (videoId, session, deps = {}) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }
  if (!session) {
    return Promise.reject('Missing second parameter: session')
  }

  const { request = requestImport } = deps
  return fetchCommentFragment(videoId, session, request)
    .then(extractPageToken)
}

export function fetchCommentFragment (videoId, session, request) {
  
}

export function extractPageToken (html) {

}
