const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

const { buildVideoPageUrl } = require('../../../lib/youtube-api/url-builder')

const noop = () => {
}

test('/lib/session-store', t => {
  t.test(' - module exports a function', t => {
    const getSession = require('../../../lib/youtube-api/session-store')
    t.equal(typeof getSession, 'function', 'is of type function')
    t.end()
  })

  t.test('- session store fetches new session tokens', t => {
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
        t.fail,
        s => {
          t.deepEqual(s, {sessionToken, commentsToken}, 'session tokens are correct')
          td.reset()
          t.end()
        }
    )
  })

  t.test('task fails if session token cannot be found', t => {
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

    t.plan(1)

    getSession(videoId)
      .fork(
        e => {
          t.ok(e, 'task rejects with an error')
          td.reset()
          t.end()
        },
        t.fail)
  })

  t.test('- session store caches tokens', t => {
    const videoId = 'the_video_id'
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const url = buildVideoPageUrl(videoId)
    const html = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = td.replace('../../../lib/utils/request')
    const getSession = require('../../../lib/youtube-api/session-store')
    td.when(request(url)).thenReturn(Task.of(html), Task.rejected('one request only'))

    getSession(videoId)
      .fork(
        t.fail,
        s => {
          getSession(videoId)
            .fork(
              t.fail,
              s => {
                t.deepEqual(s, {sessionToken, commentsToken}, 'session tokens are correct')
                td.reset()
                t.end()
              })
        })
  })
})
