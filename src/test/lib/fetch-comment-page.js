import test from 'blue-tape'
import sinon from 'sinon'

import fetchCommentPage, {
  buildFormData,
  fetchPage
} from '../../lib/fetch-comment-page'
import { buildCommentServiceUrl } from '../../lib/url-builder'

test('/lib/fetch-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof fetchCommentPage, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const getSessionToken = () => Promise.resolve()
    const videoId = 'videoId'
    const request = sinon.stub().returns(Promise.resolve())

    const returnValue = fetchCommentPage({videoId, getSessionToken})
    t.ok(returnValue instanceof Promise, 'instance of Promise')
    t.end()
  })

  t.test('- rejects the promise if videoId is missing', t => {
    return fetchCommentPage()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
      .then(() => fetchCommentPage(null, 'pageToken', () => {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
  })

  t.test('- rejects the promise if pageToken is missing', t => {
    return fetchCommentPage()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
      .then(() => fetchCommentPage('videoId', null, () => {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
  })

  t.test('- rejects the promise if getSessionToken is missing', t => {
    return fetchCommentPage()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
      .then(() => fetchCommentPage('videoId', 'pageToken'))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
  })

  t.test('- gets a session token', t => {
    const videoId = 'videoId'
    const sessionToken = 'sessionToken'
    const getSessionToken = sinon.stub().returns(Promise.resolve(sessionToken))
    const request = sinon.stub().returns(Promise.resolve())

    return fetchCommentPage(videoId, 'pageToken', getSessionToken, { request })
      .then(() => {
        t.ok(getSessionToken.calledOnce, 'get session token once')
        t.equal(getSessionToken.firstCall.args[0], videoId, 'get session token for correct video id')
      })
  })

  t.test('- buildFormData() throws an error if sessionToken is missing', t => {
    t.throws(() => buildFormData())
    t.throws(() => buildFormData(null, 'pageToken'))
    t.end()
  })

  t.test('- buildFormData() throws an error if pageToken is missing', t => {
    t.throws(() => buildFormData())
    t.throws(() => buildFormData('sessionToken'))
    t.end()
  })

  t.test('- buildFormData() builds form data', t => {
    const sessionToken = 'fake_token'
    const pageToken = 'page_token'

    const formData = buildFormData(sessionToken, pageToken)
    t.deepEqual(formData, { session_token: sessionToken, page_token: pageToken })
    t.end()
  })

  t.test('- fetchPage() returns a promise', t => {
    const returnValue = fetchPage().catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is s function')
    t.end()
  })

  t.test('- fetchPage() rejects the promise if formData is missing', t => {
    return fetchPage()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise is rejected with an error'))
      .then(() => fetchPage(null, () => {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise is rejected with an error'))
  })

  t.test('- module fetches a comment page', t => {
    const sessionToken = 'k12j34l1kj2kkHElkj='
    const videoId = '2JLK3j3k'
    const pageToken = '2kj1asdsdlkj'
    const html = '<html>content</html>'
    const url = buildCommentServiceUrl()
    const formData = {
      session_token: sessionToken,
      page_token: pageToken
    }

    const getSessionToken = sinon.stub().returns(Promise.resolve(sessionToken))
    const request = sinon.stub().returns(Promise.resolve(html))

    return fetchCommentPage(videoId, pageToken, getSessionToken, { request })
      .then(result => {
        t.ok(getSessionToken.calledOnce, 'getSessionToken called once')
        t.ok(getSessionToken.firstCall.args[0], 'getSessionToken called with correct videoId')
        t.ok(request.calledOnce, 'request called once')
        t.deepEqual(request.firstCall.args[0], {
          method: 'POST',
          form: formData,
          url
        }, 'request called with correct parameter')

        t.equal(result, html, 'returns server HTML response')
      })
  })
})
