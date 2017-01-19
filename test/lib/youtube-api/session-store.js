const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')

const { buildVideoPageUrl } = require('../../../lib/youtube-api/url-builder')

describe('/lib/youtube-api/session-store', () => {
  afterEach(() => {
    td.reset()
  })

  it(' - module exports a function', () => {
    const getSession = require('../../../lib/youtube-api/session-store')
    expect(getSession).to.be.a('function')
  })

  it('session store fetches new session tokens', done => {
    const videoId = 'first_video_id'
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const html = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(url)).thenReturn(Task.of(html))

    getSession(videoId)
      .fork(
        e => done('got an error ' + e),
        s => {
          expect(s).to.deep.equal({sessionToken, commentsToken})
          done()
        }
    )
  })

  it('task fails if session token cannot be found', done => {
    const videoId = 'the_video_id'
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const html = `<html><script>
      var stuff = {'NOTHING_TOKEN': "${sessionToken}",}
      var stuff2 = {'SOMETHING_ELSE_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')

    td.when(request(url)).thenReturn(Task.of(html))

    getSession(videoId)
      .fork(
        e => {
          expect(e).to.exist
          done()
        },
        res => done('expected task to fail'))
  })

  it('session store caches tokens', done => {
    const videoId = 'the_video_id'
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const html = `<html><script>
      var token1 = {'XSRF_TOKEN': "${sessionToken}",}
      var token2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')
    td.when(request(url)).thenReturn(Task.of(html), Task.rejected('one request only'))

    getSession(videoId)
      .fork(
        e => done('got an error ' + e),
        s => {
          getSession(videoId)
            .fork(
              e => done('got an error ' + e),
              s => {
                expect(s).to.deep.equal({sessionToken, commentsToken})
                done()
              })
        })
  })
})
