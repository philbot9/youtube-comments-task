import test from 'blue-tape'
import sinon from 'sinon'

import fetchCommentPage, {
  buildFormData,
  fetchPage
} from '../../lib/fetch-comment-page'
import { buildCommentServiceUrl } from '../../lib/url-builder'

const noop = () => {}

test('/lib/fetch-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof fetchCommentPage, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const getSession = () => Promise.resolve()
    const request = sinon.stub().returns(Promise.resolve())

    const returnValue = fetchCommentPage('videoId', 'pageToken', {getSession, request}).catch(noop)
    t.ok(returnValue instanceof Promise, 'instance of Promise')
    t.end()
  })

  t.test('- rejects the promise if videoId is missing', t => {
    return fetchCommentPage()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/videoId/.test(err), 'error is correct')
      })
      .then(() => fetchCommentPage(null, 'pageToken', {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/videoId/.test(err), 'error is correct')
      })
  })

  t.test('- rejects the promise if pageToken is missing', t => {
    return fetchCommentPage('videoId', null, {})
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/pageToken/.test(err), 'error is correct')
      })
  })

  t.test('- rejects the promise if dependencies parameter is missing', t => {
    return fetchCommentPage('videoId', 'pageToken', null)
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/dependencies/.test(err), 'Error is correct')
      })
  })

  t.test('- rejects the promise if request is missing from dependencies', t => {
    return fetchCommentPage('videoId', 'pageToken', {getSession: noop})
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/request/.test(err), 'Error is correct')
      })
      .then(() => fetchCommentPage('videoId', 'pageToken', {getSession: noop, request: null}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/request/.test(err), 'Error is correct')
      })
  })

  t.test('- rejects the promise if getSession is missing from dependencies', t => {
    return fetchCommentPage('videoId', 'pageToken', {request: noop})
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/getSession/.test(err), 'Error is correct')
      })
      .then(() => fetchCommentPage('videoId', 'pageToken', {getSession: null, request: noop}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejected with an error')
        t.ok(/getSession/.test(err), 'Error is correct')
      })
  })

  t.test('- gets a session token', t => {
    const videoId = 'videoId'
    const sessionToken = 'sessionToken'
    const commentsToken = 'commentsToken'
    const session = { sessionToken, commentsToken }
    const getSession = sinon.stub().returns(Promise.resolve(session))
    const request = sinon.stub().returns(Promise.resolve())

    return fetchCommentPage(videoId, 'pageToken', {getSession, request})
      .then(() => {
        t.ok(getSession.calledOnce, 'get session token once')
        t.equal(getSession.firstCall.args[0], videoId, 'get session token for correct video id')
      })
  })

  t.test('- buildFormData() throws an error if session is missing', t => {
    t.throws(() => buildFormData())
    t.throws(() => buildFormData(null, 'pageToken'))
    t.end()
  })

  t.test('- buildFormData() throws an error if sessionToken is missing from session', t => {
    t.throws(() => buildFormData({}, 'pageToken'))
    t.throws(() => buildFormData({commentsToken: 'commentsToken'}, 'pageToken'))
    t.end()
  })

  t.test('- buildFormData() throws an error if pageToken is missing', t => {
    t.throws(() => buildFormData())
    t.throws(() => buildFormData({}))
    t.end()
  })

  t.test('- buildFormData() builds form data', t => {
    const sessionToken = 'fake_token'
    const commentsToken = 'commentsToken'
    const session = { sessionToken, commentsToken }
    const pageToken = 'page_token'

    const formData = buildFormData(session, pageToken)
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
    const commentsToken = '3lkj3lek3j3e'
    const session = { sessionToken, commentsToken }
    const videoId = '2JLK3j3k'
    const pageToken = '2kj1asdsdlkj'
    const html = '<html>content</html>'
    const response = {content_html: html}
    const url = buildCommentServiceUrl()
    const formData = {
      session_token: sessionToken,
      page_token: pageToken
    }

    const getSession = sinon.stub().returns(Promise.resolve(session))
    const request = sinon.stub().returns(Promise.resolve(response))

    return fetchCommentPage(videoId, pageToken, {getSession, request})
      .then(result => {
        t.ok(getSession.calledOnce, 'getSession called once')
        t.ok(getSession.firstCall.args[0], 'getSession called with correct videoId')
        t.ok(request.calledOnce, 'request called once')
        t.deepEqual(request.firstCall.args[0], {
          method: 'POST',
          form: formData,
          json: true,
          url
        }, 'request called with correct parameter')

        t.equal(result, response, 'returns server HTML response')
      })
  })
})
