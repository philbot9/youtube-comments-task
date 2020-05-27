const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')

const { buildVideoPageUrl } = require('../../../lib/youtube-api/url-builder')

describe('/lib/youtube-api/session-store', () => {
  afterEach(() => {
    td.reset()
  })

  it('module exports a function', () => {
    const getSession = require('../../../lib/youtube-api/session-store')
    expect(getSession).to.be.a('function')
  })

  it('session store fetches tokens and cookies', done => {
    const videoId = 'first_video_id'
    const sessionToken =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const body = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`
    const cookieJar = { cookies: 'yep' }

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(url)).thenReturn(Task.of({ body, cookieJar }))

    getSession(videoId).fork(
      e => done('got an error ' + e),
      s => {
        expect(s).to.deep.equal({ sessionToken, commentsToken, cookieJar })
        done()
      }
    )
  })

  it('supports new video page', done => {
    const videoId = 'first_video_id'
    const sessionToken =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const body = `<html><script>
      var stuff = {, "XSRF_TOKEN":"${sessionToken}",}
      var stuff2 = { "continuation":"${commentsToken}", "blah": "comment-item-section", "continuation":"WRONG"}
    </script></html>`
    const cookieJar = { cookies: 'yep' }

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(url)).thenReturn(Task.of({ body, cookieJar }))

    getSession(videoId).fork(
      e => done('got an error ' + e),
      s => {
        expect(s).to.deep.equal({ sessionToken, commentsToken, cookieJar })
        done()
      }
    )
  })

  it('task fails if session token cannot be found', done => {
    const videoId = 'the_video_id'
    const sessionToken =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const expectedError = { error: 'here' }
    const url = buildVideoPageUrl(videoId)
    const body = `<html><script>
      var stuff = {'NOTHING_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`
    const cookieJar = { cookies: 'yep' }

    const request = td.replace('../../../lib/utils/request')
    const errorHandler = td.replace('../../../lib/error-handler')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(url)).thenReturn(Task.of({ body, cookieJar }))
    td.when(
      errorHandler.videoPageError({
        component: 'session-store',
        operation: 'extractSessionToken',
        html: body
      })
    ).thenReturn(expectedError)

    getSession(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => done('expected task to fail')
    )
  })

  it('task fails if comments token cannot be found', done => {
    const videoId = 'the_video_id'
    const sessionToken =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const expectedError = { error: 'here' }
    const url = buildVideoPageUrl(videoId)
    const body = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'SOMETHING_ELSE_TOKEN': "${encodeURIComponent(
        commentsToken
      )}",}
    </script></html>`
    const cookieJar = { cookies: 'yep' }

    const request = td.replace('../../../lib/utils/request')
    const errorHandler = td.replace('../../../lib/error-handler')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(
      errorHandler.videoPageError({
        component: 'session-store',
        operation: 'extractCommentsToken',
        html: body
      })
    ).thenReturn(expectedError)
    td.when(request(url)).thenReturn(Task.of({ body, cookieJar }))

    getSession(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => done('expected task to fail')
    )
  })

  it('caches a session', done => {
    const video1Id = 'the_first_video_id'
    const sessionToken1 =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken1 = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const body1 = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken1}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken1)}",}
    </script></html>`
    const cookieJar1 = { cookies: 'yep1' }

    const video2Id = 'the_second_video_id'
    const sessionToken2 =
      'ABCEDEUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken2 = 'ABCSSaCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const body2 = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken2}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken2)}",}
    </script></html>`
    const cookieJar2 = { cookies: 'yep2' }

    const request = td.replace('../../../lib/utils/request')
    const errorHandler = td.replace('../../../lib/error-handler')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(td.matchers.isA(String))).thenReturn(
      Task.of({ body: body1, cookieJar: cookieJar1 }),
      Task.of({ body: body2, cookieJar: cookieJar2 })
    )

    getSession(video1Id)
      .chain(res => {
        expect(res).to.deep.equal({
          sessionToken: sessionToken1,
          commentsToken: commentsToken1,
          cookieJar: cookieJar1
        })
        return getSession(video1Id)
      })
      .fork(
        e => {
          done('should not be rejected ' + e)
        },
        res => {
          expect(res).to.deep.equal({
            sessionToken: sessionToken1,
            commentsToken: commentsToken1,
            cookieJar: cookieJar1
          })
          done()
        }
      )
  })

  it('does not use cached session for different videos', done => {
    const video1Id = 'the_first_video_id'
    const sessionToken1 =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken1 = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const body1 = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken1}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken1)}",}
    </script></html>`
    const cookieJar1 = { cookies: 'yep1' }

    const video2Id = 'the_second_video_id'
    const sessionToken2 =
      'ABCEDEUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken2 = 'ABCSSaCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const body2 = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken2}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken2)}",}
    </script></html>`
    const cookieJar2 = { cookies: 'yep2' }

    const request = td.replace('../../../lib/utils/request')
    const errorHandler = td.replace('../../../lib/error-handler')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(td.matchers.isA(String))).thenReturn(
      Task.of({ body: body1, cookieJar: cookieJar1 }),
      Task.of({ body: body2, cookieJar: cookieJar2 })
    )

    getSession(video1Id)
      .chain(res => {
        expect(res).to.deep.equal({
          sessionToken: sessionToken1,
          commentsToken: commentsToken1,
          cookieJar: cookieJar1
        })
        return getSession(video2Id)
      })
      .fork(
        e => {
          done('should not be rejected ' + e)
        },
        res => {
          expect(res).not.to.deep.equal({
            sessionToken: sessionToken1,
            commentsToken: commentsToken1,
            cookieJar: cookieJar1
          })
          done()
        }
      )
  })

  it('retries if fetching video page fails', done => {
    const videoId = 'the_video_id'
    const sessionToken =
      'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const body = `<html><script>
      var token1 = {'XSRF_TOKEN': "${sessionToken}",}
      var token2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`
    const cookieJar = { cookies: 'yep' }

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(url)).thenReturn(
      Task.rejected('first one fails'),
      Task.of({ body, cookieJar })
    )

    getSession(videoId).fork(
      e => done('got an error ' + e),
      s => {
        expect(s).to.deep.equal({ sessionToken, commentsToken, cookieJar })
        done()
      }
    )
  })
})
