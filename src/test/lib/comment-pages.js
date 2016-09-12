import test from 'blue-tape'
import sinon from 'sinon'
import Rx from 'rxjs'

import buildCommentPageStream, {
  buildFetchAndEmitAllPages,
  extractNextPageToken
} from '../../lib/comment-pages'

test.only('/lib/comment-pages.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof buildCommentPageStream, 'function', 'is of type function')
    t.end()
  })

  t.test('- throws an error if videoId parameter is missing', t => {
    t.throws(() => buildCommentPageStream())
    t.throws(() => buildCommentPageStream(null, () => {}))
    t.end()
  })

  t.test('- throws an error if getSession parameter is missing', t => {
    t.throws(() => buildCommentPageStream())
    t.throws(() => buildCommentPageStream('videoId'))
    t.end()
  })

  t.test('- returns an Rx Observable', t => {
    const returnValue = buildCommentPageStream('videoId', () => {})
    t.ok(returnValue instanceof Rx.Observable, 'is an instance of Rx.Observable')
    t.end()
  })

  t.test('- buildFetchAndEmitAllPages() returns a function', t => {
    const noop = () => {}
    const returnValue = buildFetchAndEmitAllPages({
      videoId: 'videoId',
      observer: {},
      getSession: noop,
      fetchCommentPage: noop
    })
    t.equal(typeof returnValue, 'function', 'is of type function')
    t.end()
  })

  t.test('- buildFetchAndEmitAllPages() throws an error on missing parameters', t => {
    t.throws(() => buildFetchAndEmitAllPages())
    t.throws(() => buildFetchAndEmitAllPages({}))
    t.throws(() => buildFetchAndEmitAllPages({videoId: 'videoId'}))
    t.throws(() => buildFetchAndEmitAllPages({videoId: 'videoId', observer: {}}))
    t.throws(() => buildFetchAndEmitAllPages({videoId: 'videoId', observer: {}, getSession: () => {}}))
    t.end()
  })

  t.test('- built fetchAndEmitAllPages() returns a promise', t => {
    const videoId = 'videoId'
    const observer = { next: sinon.stub() }
    const fetchCommentPage = sinon.stub().returns(Promise.resolve())
    const getSession = sinon.stub().returns(Promise.resolve())

    const fetchAndEmitAllPages = buildFetchAndEmitAllPages({ videoId, observer, fetchCommentPage, getSession })
    const returnValue = fetchAndEmitAllPages()
    t.ok(returnValue instanceof Promise, 'is instance of promise')
    t.end()
  })

  t.test('- built fetchAndEmitAllPages() rejects the promise if pageToken parameter is missing', t => {
    const videoId = 'videoId'
    const observer = { next: sinon.stub() }
    const fetchCommentPage = sinon.stub().returns(Promise.resolve())
    const getSession = sinon.stub().returns(Promise.resolve())

    const fetchAndEmitAllPages = buildFetchAndEmitAllPages({
      videoId,
      observer,
      fetchCommentPage,
      getSession
    })

    return fetchAndEmitAllPages()
      .then(() => t.fail('promise should not resolve'))
      .catch(err => t.ok(err, 'promise is rejected with an error'))
  })

  t.test('- built fetchAndEmitAllPages() rejects the promise if pageToken parameter is missing', t => {
    const videoId = 'videoId'
    const observer = { next: sinon.stub() }
    const fetchCommentPage = sinon.stub().returns(Promise.resolve())
    const getSession = sinon.stub().returns(Promise.resolve())

    const fetchAndEmitAllPages = buildFetchAndEmitAllPages({
      videoId,
      observer,
      fetchCommentPage,
      getSession
    })

    return fetchAndEmitAllPages()
      .then(() => t.fail('promise should not resolve'))
      .catch(err => t.ok(err, 'promise is rejected with an error'))
  })

  t.test('- built fetchAndEmitAllPages() fetches and emits all comment pages', t => {
    const videoId = 'videoId'
    const observer = { next: sinon.stub() }
    const fetchCommentPage = sinon.stub().returns(Promise.resolve())
    const getSession = sinon.stub().returns(Promise.resolve())

    const extractNextPageToken = sinon.stub()
    const pageTokens = ['pageToken1', 'pageToken2', 'pageToken3']
    pageTokens.forEach((pageToken, i) => {
      extractNextPageToken.onCall(i).returns(pageToken)
    })

    const fetchAndEmitAllPages = buildFetchAndEmitAllPages({
      videoId,
      observer,
      fetchCommentPage,
      getSession,
      extractNextPageToken
    })

    t.fail('incomplete test')

    return fetchAndEmitAllPages()
      .then(() => t.fail('promise should not resolve'))
      .catch(err => t.ok(err, 'promise is rejected with an error'))
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
})
