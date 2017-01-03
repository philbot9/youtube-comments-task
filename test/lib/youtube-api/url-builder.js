const test = require('blue-tape')
const nodeUrl = require('url')

const {
  VIDEO_PAGE_URL,
  WATCH_FRAGMENTS_URL,
  COMMENT_SERVICE_URL,
  buildVideoPageUrl,
  buildWatchFragmentsUrl,
  buildCommentServiceUrl
} = require('../../../lib/youtube-api/url-builder')

test('/lib/url-build.js', t => {
  t.test('- exports buildVideoPageUrl() function', t => {
    t.ok(buildVideoPageUrl, 'exports buildVideoPageUrl')
    t.equal(typeof buildVideoPageUrl, 'function', 'is of type function')
    t.end()
  })

  t.test('- exports buildWatchFragmentsUrl() function', t => {
    t.ok(buildWatchFragmentsUrl, 'exports buildWatchFragmentsUrl')
    t.equal(typeof buildWatchFragmentsUrl, 'function', 'is of type function')
    t.end()
  })

  t.test('- buildVideoPageUrl() builds a video page url', t => {
    const videoId = 'K23jKl24k'
    const urlStr = buildVideoPageUrl(videoId)

    t.ok(urlStr.indexOf(`${VIDEO_PAGE_URL}?`) === 0, 'starts with correct base url')

    const url = nodeUrl.parse(urlStr, true)
    t.ok(url, 'url parsed successfully')
    t.deepEqual(url.query, {v: videoId}, 'query contains correct values')
    t.end()
  })

  t.test('- buildWatchFragmentsUrl() builds a watch fragments url', t => {
    const videoId = 'K23jKl24k'
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const session = { commentsToken}
    const fragments = ['comments', 'andmore']

    const urlStr = buildWatchFragmentsUrl(videoId, session, fragments)
    t.ok(urlStr.indexOf(`${WATCH_FRAGMENTS_URL}?`) === 0, 'starts with correct base url')

    const url = nodeUrl.parse(urlStr, true)
    t.deepEqual(url.query, {
      v: videoId,
      ctoken: commentsToken,
      frags: fragments.join(','),
      tr: 'time',
      distiller: '1',
      spf: 'load'
    }, 'query contains correct values')
    t.end()
  })

  t.test('- buildWatchFragmentsUrl() uses default fragment if not given', t => {
    const videoId = 'K23jKl24k'
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const session = { commentsToken}
    const defaultFragment = 'comments'

    const urlStr = buildWatchFragmentsUrl(videoId, session)
    t.ok(urlStr.indexOf(`${WATCH_FRAGMENTS_URL}?`) === 0, 'starts with correct base url')

    const url = nodeUrl.parse(urlStr, true)
    t.deepEqual(url.query, {
      v: videoId,
      ctoken: commentsToken,
      frags: defaultFragment,
      tr: 'time',
      distiller: '1',
      spf: 'load'
    }, 'query contains correct values')
    t.end()
  })

  t.test('- buildCommentServiceUrl() returns the comment service url', t => {
    t.equal(buildCommentServiceUrl(), COMMENT_SERVICE_URL, 'url is correct')
    t.end()
  })
})
