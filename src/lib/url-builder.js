import qs from 'querystring'

export const VIDEO_PAGE_URL = 'https://www.youtube.com/watch'
export const WATCH_FRAGMENTS_URL = 'https://www.youtube.com/watch_fragments_ajax'

export function buildVideoPageUrl (videoId) {
  const query = qs.stringify({
    v: videoId
  })

  return `${VIDEO_PAGE_URL}?${query}`
}

export function buildWatchFragmentsUrl (videoId, commentsToken, fragments = ['comments']) {
  const query = qs.stringify({
    v: videoId,
    ctoken: commentsToken,
    frags: fragments.join(','),
    tr: 'time',
    distiller: 1,
    spf: 'load'
  })

  return `${WATCH_FRAGMENTS_URL}?${query}`
}
