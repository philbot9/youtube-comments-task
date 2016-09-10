import test from 'blue-tape'
import sinon from 'sinon'

import buildSessionStore, { URL_TEMPLATE } from '../../lib/session-store'

test('/lib/session-store', t => {
  t.test(' - module exports a function', t => {
    t.ok(typeof buildSessionStore === 'function', 'is of type function')
    t.end()
  })

  t.test('- exported function returns a session store function', t => {
    t.ok(typeof buildSessionStore() === 'function', 'is of type function')
    t.end()
  })

  t.test('- session store returns a promise', t => {
    const request = sinon.stub().returns(Promise.resolve())
    const getSessionToken = buildSessionStore({}, { request })
    const returnValue = getSessionToken('videoid')
      .catch(() => {})
      .then(() => {
        t.ok(returnValue instanceof Promise, 'is instance of promise')
      })
    return returnValue
  })

  t.test('- fetches correct video page', t => {
    const request =  sinon.stub().returns(Promise.resolve())
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .catch(() => {})
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
      })
  })

  t.test('- parses session token', t => {
    const token = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const html = `<html><script>var stuff = {'XSRF_TOKEN': "${token}"}</script></html>`
    const request = sinon.stub().returns(Promise.resolve(html))

    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.ok(request.calledWith(url), 'request called with correct url')
        t.equal(sessionToken, token)
      })
  })

  t.test('- caches session token', t => {
    const token = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const html = `<html><script>var stuff = {'XSRF_TOKEN': "${token}"}</script></html>`
    const request = sinon.stub().returns(Promise.resolve(html))
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.ok(request.calledWith(url), 'request called with correct url')
        t.equal(sessionToken, token)
        return getSessionToken(videoId)
      })
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(sessionToken, token)
      })
  })

  t.test('- fetches token if cache has expired', t => {
    const token = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const html = `<html><script>var stuff = {'XSRF_TOKEN': "${token}"}</script></html>`
    const request = sinon.stub().returns(Promise.resolve(html))
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({cacheDuration: 1}, { request })
    return getSessionToken(videoId)
      .then(sessionToken => {
        t.ok(request.calledOnce, 'request called once')
        t.equal(request.firstCall.args[0], url, 'request called with correct url')
        t.equal(sessionToken, token, 'returns the correct session token')
        return new Promise(resolve => {
          setTimeout(() => resolve(getSessionToken(videoId)), 10)
        })
      })
      .then(sessionToken => {
        t.ok(request.calledTwice, 'request called again')
        t.equal(request.secondCall.args[0], url, 'request called again with correct url')
        t.equal(sessionToken, token, 'returns correct session token')
      })
  })
})
