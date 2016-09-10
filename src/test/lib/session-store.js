import test from 'blue-tape'
import sinon from 'sinon'

import buildSessionStore, { URL_TEMPLATE } from '../../lib/session-store'

test('/lib/session-store', t => {
  t.test(' - module exports a function', t => {
    t.ok(typeof buildSessionStore === 'function', 'is of type function')
    t.end()
  })

  t.test(' - exported function returns a session store function', t => {
    t.ok(typeof buildSessionStore() === 'function', 'is of type function')
    t.end()
  })

  t.test(' - session store returns a promise', t => {
    const request = {
      get: sinon.stub().returns(Promise.resolve())
    }
    const getSessionToken = buildSessionStore({}, { request })
    const returnValue = getSessionToken('videoid')
      .catch(() => {})
      .then(() => {
        t.ok(returnValue instanceof Promise, 'is instance of promise')
      })
    return returnValue
  })

  t.test(' - fetches correct video page', t => {
    const request = {
      get: sinon.stub().returns(Promise.resolve())
    }
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .catch(() => {})
      .then(sessionToken => {
        t.ok(request.get.calledOnce, 'request called once')
        t.ok(request.get.calledWith(url), 'request called with correct url')
      })
  })

  t.test(' - parses session token', t => {
    const fakeToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const fakeHtml = `<html><script>var stuff = {'XSRF_TOKEN': "${fakeToken}"}</script></html>`
    const request = {
      get: sinon.stub().returns(Promise.resolve(fakeHtml))
    }
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .then(sessionToken => {
        t.ok(request.get.calledOnce, 'request called once')
        t.ok(request.get.calledWith(url), 'request called with correct url')
        t.equal(sessionToken, fakeToken)
      })
  })

  t.test(' - caches session token', t => {
    const fakeToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const fakeHtml = `<html><script>var stuff = {'XSRF_TOKEN': "${fakeToken}"}</script></html>`
    const request = {
      get: sinon.stub().returns(Promise.resolve(fakeHtml))
    }
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({}, { request })
    return getSessionToken(videoId)
      .then(sessionToken => {
        t.ok(request.get.calledOnce, 'request called once')
        t.ok(request.get.calledWith(url), 'request called with correct url')
        t.equal(sessionToken, fakeToken)
        return getSessionToken(videoId)
      })
      .then(sessionToken => {
        t.ok(request.get.calledOnce, 'request called once')
        t.equal(sessionToken, fakeToken)
      })
  })

  t.test(' - fetches token if cache has expired', t => {
    const fakeToken = 'QUFLUhqbDZ4eC1NMnZoRTBaYWdJZjhvanpZMXNPdFMtd3xBQ3Jtc0tsZ21BdmtSOHd5ZV9Oekd1cEVGdmR2TlhrZkFpaGJOcGhOZzg1YmtmUTljYVV3V2R3dGxFdTl4TkN3WWNHVFo3b0ZpZXV0VnhYYVFrMGh1OHkyRzR1UGNvYmNoblRSZ0NhbXdIbFRXUmIyUGdPZkh1TWRkREJ2d3hsSDFRdlhRZEM0dHNoUDJVdjJncXB2V211dFBCUlFPSHl2d2c='
    const fakeHtml = `<html><script>var stuff = {'XSRF_TOKEN': "${fakeToken}"}</script></html>`
    const request = {
      get: sinon.stub().returns(Promise.resolve(fakeHtml))
    }
    const videoId = '2a4Uxdy9TQY'
    const url = URL_TEMPLATE.replace('{{videoId}}', '2a4Uxdy9TQY')

    const getSessionToken = buildSessionStore({cacheDuration: 1}, { request })
    return getSessionToken(videoId)
      .then(sessionToken => {
        t.ok(request.get.calledOnce, 'request called once')
        t.ok(request.get.calledWith(url), 'request called with correct url')
        t.equal(sessionToken, fakeToken)
        return new Promise(resolve => {
          setTimeout(() => resolve(getSessionToken(videoId)), 10)
        })
      })
      .then(sessionToken => {
        t.ok(request.get.calledTwice, 'request called again')
        t.ok(request.get.calledWith(url), 'request called again with correct url')
        t.equal(sessionToken, fakeToken)
      })
  })
})