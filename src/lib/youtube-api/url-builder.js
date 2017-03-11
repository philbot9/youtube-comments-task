const qs = require('querystring')

const VIDEO_PAGE_URL = 'https://www.youtube.com/watch'
const WATCH_FRAGMENTS_URL = 'https://www.youtube.com/watch_fragments_ajax'
const COMMENT_SERVICE_URL = 'https://www.youtube.com/comment_service_ajax'

const buildVideoPageUrl = videoId => {
  const query = qs.stringify({
    v: videoId
  })

  return `${VIDEO_PAGE_URL}?${query}`
}

const buildWatchFragmentsUrl = (videoId, session, fragments = ['comments']) => {
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

const buildCommentServiceUrl = action => `${COMMENT_SERVICE_URL}?${action}=1`

module.exports = {
  VIDEO_PAGE_URL,
  WATCH_FRAGMENTS_URL,
  COMMENT_SERVICE_URL,
  buildVideoPageUrl,
  buildWatchFragmentsUrl,
buildCommentServiceUrl}
