import qs from 'querystring'

export const VIDEO_PAGE_URL = 'https://www.youtube.com/watch'
export const WATCH_FRAGMENTS_URL = 'https://www.youtube.com/watch_fragments_ajax'
export const COMMENT_SERVICE_URL = 'https://www.youtube.com/comment_service_ajax?action_get_comments=1'

export function buildVideoPageUrl (videoId) {
  const query = qs.stringify({
    v: videoId
  })

  return `${VIDEO_PAGE_URL}?${query}`
}

export function buildWatchFragmentsUrl (videoId, session, fragments = ['comments']) {
  const query = qs.stringify({
    v: videoId,
    ctoken: session.commentsToken,
    frags: fragments.join(','),
    tr: 'time',
    distiller: 1,
    spf: 'load'
  })

  return `${WATCH_FRAGMENTS_URL}?${query}`
}

export function buildCommentServiceUrl () {
  return COMMENT_SERVICE_URL
}
