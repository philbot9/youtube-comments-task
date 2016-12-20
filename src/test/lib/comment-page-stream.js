import test from 'blue-tape'
import sinon from 'sinon'
import Rx from 'rxjs'

import buildCommentPageStream, {
  extractNextPageToken,
  fetchCommentPage
} from '../../lib/comment-page-stream'
import { buildCommentServiceUrl } from '../../lib/url-builder'

const noop = () => {}

test('/lib/comment-page-stream.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof buildCommentPageStream, 'function', 'is of type function')
    t.end()
  })

  t.test('- throws an error if videoId parameter is missing', t => {
    t.throws(() => buildCommentPageStream())
    t.throws(() => buildCommentPageStream(null, {}))
    t.end()
  })

  t.test('- throws an error if dependencies parameter is missing', t => {
    t.throws(() => buildCommentPageStream())
    t.throws(() => buildCommentPageStream('videoId', null))
    t.end()
  })

  t.test('- throws an error if getSession is missing from dependencies parameter', t => {
    t.throws(() => buildCommentPageStream('videoId', {request: noop}), /getSession/)
    t.throws(() => buildCommentPageStream('videoId', {request: noop, getSession: null}), /getSession/)
    t.end()
  })

  t.test('- throws an error if request is missing from dependencies parameter', t => {
    t.throws(() => buildCommentPageStream('videoId', {getSession: noop}), /request/)
    t.throws(() => buildCommentPageStream('videoId', {getSession: noop, request: null}), /request/)
    t.end()
  })

  t.test('- returns an Rx Observable', t => {
    const dependencies = { getSession: noop, request: noop}
    const returnValue = buildCommentPageStream('videoId', dependencies)
    t.ok(returnValue instanceof Rx.Observable, 'is an instance of Rx.Observable')
    t.end()
  })

  t.test('- extractNextPageToken() throws an error if response parameter is missing', t => {
    t.throws(() => extractNextPageToken())
    t.end()
  })

  t.test('- extractNextPageToken() returns null if load_more_widget_html is missing from response parameter',
    t => {
      t.equal(null, extractNextPageToken({}))
      t.equal(null, extractNextPageToken({something: 'else'}))
      t.end()
    })

  t.test('- extractNextPageToken() throws an error if correct button element is missing', t => {
    const html = '<html><button class="yt-ui-nonsense">Not it!</button></html>'
    t.throws(() => extractNextPageToken({load_more_widget_html: html}))
    t.end()
  })

  t.test('- extractNextPageToken() throws an error if button doesn\'t have page token attribute', t => {
    const html = '<html><button class="comment-section-renderer-paginator">Not it!</button></html>'
    t.throws(() => extractNextPageToken({load_more_widget_html: html}))
    t.end()
  })

  t.test('- extractNextPageToken() returns the nextPageToken', t => {
    const nextPageToken = 'EhYSC0szYUN1S0JXRTNBwAEAyAEA4AEBGAYyWRpXEiN6MTJ2ZWJ2eHRyemd3MWlrYjIzMXhicHB1d2U0anZoYWcwNCICCAAqGFVDNTBxQjFtZk5OQmY4ZVNoWDAxNXc1UTILSzNhQ3VLQldFM0E4AEABSPQD'
    const html = [
      '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-section-renderer-paginator yt-uix-sessionlink" type="button" onclick=";return false;" aria-label="Show more" data-uix-load-more-href="/comment_service_ajax?action_get_comments=1" data-uix-load-more-post="true" data-sessionlink="itct=CAEQuy8iEwil05qF1YfPAhVOL04KHT7rAEU" data-uix-load-more-target-id="comment-section-renderer-items" data-uix-load-more-post-body=',
      `"page_token=${nextPageToken}"`,
      'data-sessionlink-target="/comment_service_ajax?action_get_comments=1"><span class="yt-uix-button-content">  <span class="load-more-loading hid">',
      '<span class="yt-spinner"><span title="Loading icon" class="yt-spinner-img  yt-sprite"></span>Loading...</span></span>',
      '<span class="load-more-text">Show more</span></span></button>'
    ].join('')

    const returnValue = extractNextPageToken({load_more_widget_html: html})
    t.equal(returnValue, nextPageToken)
    t.end()
  })

  t.test('- fetchCommentPage() returns a promise', t => {
    const getSession = sinon.stub().returns(Promise.resolve())
    const returnValue = fetchCommentPage('', '', {getSession}).catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is s function')
    t.end()
  })

  t.test('- fetchCommentPage() fetches a comment page', t => {
    const requestResult = { test: 'value' }
    const session = {session: 'token'}
    const formData = {form: 'data'}
    const request = sinon.stub().returns(Promise.resolve(requestResult))
    const getSession = sinon.stub().returns(Promise.resolve(session))
    const buildRequestFormData = sinon.stub().returns(formData)
    const videoId = 'theVideoId'
    const pageToken = 'pageToken'
    const url = buildCommentServiceUrl()

    return fetchCommentPage(videoId, pageToken, { request, getSession, buildRequestFormData})
      .then(result => {
        t.deepEqual(result, requestResult, 'request result is correct')

        t.ok(getSession.calledOnce, 'getSession called once')
        t.equal(getSession.getCall(0).args[0], videoId, 'getSession called with correct videoId')

        t.ok(buildRequestFormData.calledOnce, 'buildRequestFormData called once')
        t.deepEqual(buildRequestFormData.getCall(0).args[0], session, 'called with correct session')
        t.equal(buildRequestFormData.getCall(0).args[1], pageToken, 'called with correct page token')

        t.ok(request.calledOnce, 'request called once')
        const requestObject = request.getCall(0).args[0]
        t.equal(requestObject.method, 'POST', 'request method POST')
        t.deepEqual(requestObject.form, formData, 'request form data is correct')
        t.equal(requestObject.url, url, 'request url is correct')
      })
  })

  t.test('- Tests are complete', t => {
    t.ok(false, 'TESTS ARE INCOMPLETE!')
    t.end()
  })

})
