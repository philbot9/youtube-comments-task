const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

const request = td.replace('../../../lib/utils/request')
const buildSessionStore = require('../../../lib/youtube-api/session-store')

const { buildVideoPageUrl } = require('../../../lib/youtube-api/url-builder')

const noop = () => {
}

test('/lib/session-store', t => {
  t.test(' - module exports a function', t => {
    t.ok(typeof buildSessionStore === 'function', 'is of type function')
    t.end()
  })

  t.test('- exported function returns a function', t => {
    t.ok(typeof buildSessionStore({}, {request: noop}) === 'function',
      'is of type function')
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

    td.when(request(url)).thenReturn(Task.of(html))

    const getSessionToken = buildSessionStore({})
    getSessionToken(videoId)
      .fork(
        t.notOk,
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

    td.when(request(url)).thenReturn(Task.of(html))

    const getSessionToken = buildSessionStore({})
    getSessionToken(videoId)
      .fork(
        e => {
          t.ok(e, 'task rejects with an error')
          t.end()
        },
        t.notOk
    )
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

    td.when(request(url)).thenReturn(Task.of(html), Task.rejected('one request only'))

    const getSessionToken = buildSessionStore({})
    getSessionToken(videoId)
      .fork(
        t.notOk,
        s => {
          t.deepEqual(s, {sessionToken, commentsToken}, 'session tokens are correct')
        }
    )

    getSessionToken(videoId)
      .fork(
        t.notOk,
        s => {
          t.deepEqual(s, {sessionToken, commentsToken}, 'session tokens are correct')
          td.reset()
          t.end()
        }
    )
  })

  t.test('- session store re-fetches expired tokens', t => {
    const videoId = 'the_video_id'
    const sessionToken1 = 'sessionToken1'
    const commentsToken1 = 'commentToken1'
    const sessionToken2 = 'sessionToken2'
    const commentsToken2 = 'commentToken2'
    const url = buildVideoPageUrl(videoId)

    const html1 = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken1}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken1)}",}
    </script></html>`

    const html2 = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken2}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken2)}",}
    </script></html>`

    td.when(request(url)).thenReturn(Task.of(html1), Task.of(html2))

    const getSessionToken = buildSessionStore({cacheDuration: 1})
    getSessionToken(videoId)
      .fork(
        t.notOk,
        s => {
          t.deepEqual(s, {sessionToken: sessionToken1, commentsToken: commentsToken1}, 'session tokens are correct')
        }
    )

    setTimeout(() => {
      getSessionToken(videoId)
        .fork(
          t.notOk,
          s => {
            t.deepEqual(s, {sessionToken: sessionToken2, commentsToken: commentsToken2}, 'session tokens are correct')
            td.reset()
            t.end()
          }
      )
    }, 10)
  })
})
