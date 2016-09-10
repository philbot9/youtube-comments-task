import test from 'blue-tape'
import sinon from 'sinon'

import buildSessionStore, {
  URL_TEMPLATE,
  SESSION_TOKEN_REGEX,
  COMMENTS_TOKEN_REGEX,
  fetchVideoPage,
  extractToken
} from '../../lib/session-store'

test('/lib/session-store', t => {
  t.test(' - module exports a function', t => {
    t.ok(typeof buildSessionStore === 'function', 'is of type function')
    t.end()
  })

  t.test('- exported function returns a function', t => {
    t.ok(typeof buildSessionStore() === 'function', 'is of type function')
    t.end()
  })

  t.test('- session store returns a promise', t => {
    const request = sinon.stub().returns(Promise.resolve())
    const getSessionToken = buildSessionStore({}, { request })

    const returnValue = getSessionToken('videoid').catch(() => {})
    t.ok(returnValue instanceof Promise, 'is instance of promise')
    t.end()
  })

  t.test('- fetchVideoPage() returns a promise', t => {
    const videoId = '2a4Uxdy9TQY'
    const request =  sinon.stub().returns(Promise.resolve())

    const returnValue = fetchVideoPage(videoId, request)
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is a function')
    t.end()
  })

  t.test('- fetchVideoPage() requires a videoId parameter', t => {
    return fetchVideoPage()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(true, 'promise is rejected')
        t.ok(err, 'rejected promise has an error')
      })
  })

  t.test('- fetchVideoPage() requires a request function parameter', t => {
    const videoId = '2a4Uxdy9TQY'

    return fetchVideoPage(videoId)
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(true, 'promise is rejected')
        t.ok(err, 'rejected promise has an error')
      })
  })

  t.test('- fetchVideoPage() fetches correct URL', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', videoId)
    const request =  sinon.stub().returns(Promise.resolve())

    return fetchVideoPage(videoId, request)
      .then(() => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
      })
  })

  t.test('- session store fetches correct video page', t => {
    const videoId = '2a2U4dg9sQZ'
    const url = URL_TEMPLATE.replace('{{videoId}}', videoId)
    const request =  sinon.stub().returns(Promise.resolve())

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .catch(() => {})
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
      })
  })

  t.test('- extractToken() requires regex parameter', t => {
    t.throws(() => extractToken(), 'throws error for no parameters')
    t.throws(() => extractToken(null, '<html/>'), 'throws error for missing regex parameter')
    t.end()
  })

  t.test('- extractToken() requires html parameter', t => {
    t.throws(() => extractToken(), 'throws error for no parameters')
    t.throws(() => extractToken(/test/), 'throws error for missing html parameter')
    t.end()
  })

  t.test('- extractToken() extracts tokens from html', t => {
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY%3D'
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${commentsToken}",}
    </script></html>`

    const extractedSessionToken = extractToken(SESSION_TOKEN_REGEX, videoPageHtml)
    t.equal(extractedSessionToken, sessionToken)

    const extractedCommentsToken = extractToken(COMMENTS_TOKEN_REGEX, videoPageHtml)
    t.equal(extractedCommentsToken, commentsToken)

    t.end()
  })

  t.test('- session store extracts session tokens', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY%3D'
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${commentsToken}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({}, { request })

    return getSession(videoId)
      .then(session => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
        t.deepEqual(session, { sessionToken, commentsToken })
      })
  })

  t.test('- session store caches tokens', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY%3D'
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${commentsToken}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({}, { request })

    return getSession(videoId)
      .then(session => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
        t.deepEqual(session, { sessionToken, commentsToken }, 'tokens are correct')
        return getSession(videoId)
      })
      .then(session => {
        t.ok(request.calledOnce, 'request still only called once')
        t.deepEqual(session, { sessionToken, commentsToken }, 'tokens are correct')
      })
  })

  t.test('- session store fetches tokens if cache has expired', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY%3D'
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${commentsToken}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({cacheDuration: 1}, { request })

    return getSession(videoId)
      .then(session => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
        t.deepEqual(session, { sessionToken, commentsToken }, 'tokens are correct')
        return new Promise(resolve => {
          setTimeout(() => resolve(getSession(videoId)), 10)
        })
      })
      .then(session => {
        t.ok(request.calledTwice, 'request called again')
        t.equal(request.secondCall.args[0], url, 'request called again with correct url')
        t.deepEqual(session, { sessionToken, commentsToken }, 'tokens are correct again')
      })
  })
})
