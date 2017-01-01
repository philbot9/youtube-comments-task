const test = require('blue-tape')
const sinon = require('sinon')

const buildSessionStore = require('../../lib/session-store')

const { buildVideoPageUrl } = require('../../lib/url-builder')

const noop = () => {}

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

  t.test('- session store returns a promise', t => {
    const request = sinon.stub().returns(Promise.resolve())
    const getSessionToken = buildSessionStore({}, {request})

    const returnValue = getSessionToken('videoid').catch(() => {})
    t.ok(returnValue instanceof Promise, 'is instance of promise')
    t.end()
  })

  t.test('- promise is rejected if videoId is missing', t => {
    const request = sinon.stub().returns(Promise.resolve())
    const getSessionToken = buildSessionStore({}, {request})

    return getSessionToken()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/videoId/i.test(err), 'error is correct')
      })
  })

  t.test('- session store fetches correct video page', t => {
    const videoId = '2a2U4dg9sQZ'
    const url = buildVideoPageUrl(videoId)
    const request =  sinon.stub().returns(Promise.resolve())

    t.plan(2)

    const getSessionToken = buildSessionStore({}, {request})
    return getSessionToken(videoId)
      .catch(() => {})
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
      })
  })

  t.test('- session store URI decodes the comments token', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = buildVideoPageUrl(videoId)
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({}, {request})

    return getSession(videoId)
      .then(session => {
        t.equal(session.commentsToken, commentsToken, 'returns decoded commments token')
      })
  })

  t.test('- session store extracts session tokens', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = buildVideoPageUrl(videoId)
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({}, {request})

    return getSession(videoId)
      .then(session => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
        t.deepEqual(session, { sessionToken, commentsToken })
      })
  })

  t.test('- session store caches tokens', t => {
    const videoId = '2a4Uxdy9TQY'
    const url = buildVideoPageUrl(videoId)
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({}, {request})

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
    const url = buildVideoPageUrl(videoId)
    const sessionToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const commentsToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAY='
    const videoPageHtml = `<html><script>
      var stuff = {'XSRF_TOKEN': "${sessionToken}",}
      var stuff2 = {'COMMENTS_TOKEN': "${encodeURIComponent(commentsToken)}",}
    </script></html>`

    const request = sinon.stub().returns(Promise.resolve(videoPageHtml))
    const getSession = buildSessionStore({cacheDuration: 1}, {request})

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
