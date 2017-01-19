const { expect } = require('chai')
const nodeUrl = require('url')

const {
  VIDEO_PAGE_URL,
  WATCH_FRAGMENTS_URL,
  COMMENT_SERVICE_URL,
  buildVideoPageUrl,
  buildWatchFragmentsUrl,
  buildCommentServiceUrl
} = require('../../../lib/youtube-api/url-builder')

describe('/lib/youtube-api/url-build.js', () => {
  it('exports buildVideoPageUrl() function', () => {
    expect(buildVideoPageUrl).to.be.a('function')
  })

  it('exports buildWatchFragmentsUrl() function', () => {
    expect(buildWatchFragmentsUrl).to.be.a('function')
  })

  it('exports a buildCommentServiceUrl() function', () => {
    expect(buildCommentServiceUrl).to.be.a('function')
  })

  it('buildVideoPageUrl() builds a video page url', () => {
    const videoId = 'K23jKl24k'
    const urlStr = buildVideoPageUrl(videoId)

    expect(urlStr.indexOf(`${VIDEO_PAGE_URL}?`)).to.equal(0)

    const url = nodeUrl.parse(urlStr, true)
    expect(url.query).to.deep.equal({v: videoId})
  })

  it('buildWatchFragmentsUrl() builds a watch fragments url', () => {
    const videoId = 'K23jKl24k'
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const session = { commentsToken}
    const fragments = ['comments', 'andmore']

    const urlStr = buildWatchFragmentsUrl(videoId, session, fragments)
    expect(urlStr.indexOf(`${WATCH_FRAGMENTS_URL}?`)).to.equal(0)

    const url = nodeUrl.parse(urlStr, true)
    expect(url.query).to.deep.equal({
      v: videoId,
      ctoken: commentsToken,
      frags: fragments.join(','),
      tr: 'time',
      distiller: '1',
      spf: 'load'
    })
  })

  it('buildWatchFragmentsUrl() uses default fragment if not given', () => {
    const videoId = 'K23jKl24k'
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const session = { commentsToken }
    const defaultFragment = 'comments'

    const urlStr = buildWatchFragmentsUrl(videoId, session)
    expect(urlStr.indexOf(`${WATCH_FRAGMENTS_URL}?`)).to.equal(0)

    const url = nodeUrl.parse(urlStr, true)
    expect(url.query).to.deep.equal({
      v: videoId,
      ctoken: commentsToken,
      frags: defaultFragment,
      tr: 'time',
      distiller: '1',
      spf: 'load'
    })
  })

  it('buildCommentServiceUrl() builds a comment service url', () => {
    const action = 'action_get_comments'
    const exp = `${COMMENT_SERVICE_URL}?${action}=1`
    expect(buildCommentServiceUrl(action)).to.equal(exp)
  })
})
