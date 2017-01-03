const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('../../../lib/youtube-api/url-builder')
const buildRequestFormData = require('../../../lib/youtube-api/build-request-form-data')

test('/lib/youtube-api', t => {
  t.test('module exports an object', t => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    t.equal(typeof Youtube, 'object', 'is of type object')
    t.end()
  })

  t.test('commentPage is a function on the object', t => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    t.equal(typeof Youtube.commentPage, 'function', 'is of type function')
    t.end()
  })

  t.test('commentPage fetches comment page', t => {
    const videoId = 'videoId'
    const pageToken = 'pageToken'
    const url = buildCommentServiceUrl()
    const html = '<p>comment page</p>'
    const apiResponse = { content_html: html }
    const session = {sessionToken: 'sess', commentsToken: 'comm'}

    const getSession = td.replace('../../../lib/youtube-api/session-store')
    const request = td.replace('../../../lib/utils/request')
    const Youtube = require('../../../lib/youtube-api/youtube-api')

    const requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: pageToken,
        session_token: session.sessionToken
      }
    })

    td.when(request(requestMatcher))
      .thenReturn(Task.of(apiResponse))

    td.when(getSession(videoId))
      .thenReturn(Task.of(session))

    Youtube.commentPage(videoId, pageToken)
      .fork(t.fail,
            res => t.deepEqual(res, apiResponse))

    td.reset()
    t.end()
  })

  t.test('videoPage will re-fetch if first attempt fails', t => {
    const videoId = 'videoId'
    const pageToken = 'pageToken'
    const url = buildCommentServiceUrl()
    const html = '<p>comment page</p>'
    const apiResponse = { content_html: html }
    const session = {sessionToken: 'sess', commentsToken: 'comm'}

    const getSession = td.replace('../../../lib/youtube-api/session-store')
    const request = td.replace('../../../lib/utils/request')
    const Youtube = require('../../../lib/youtube-api/youtube-api')

    const requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: pageToken,
        session_token: session.sessionToken
      }
    })

    td.when(request(requestMatcher))
      .thenReturn(Task.rejected('na-ah'), Task.of(apiResponse))

    td.when(getSession(videoId))
      .thenReturn(Task.of(session))

    t.plan(1)

    Youtube.commentPage(videoId, pageToken)
      .fork(t.fail,
            res => {
              t.deepEqual(res, apiResponse)
              td.reset()
              t.end()
            })
  })

  t.test('commentsWatchFragment is a function on the object', t => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    t.equal(typeof Youtube.commentsWatchFragment, 'function', 'is of type function')
    t.end()
  })

  t.test('commentsWatchFragment fetches comments watch fragment', t => {
    const videoId = 'videoId'
    const session = {sessionToken: 'sess', commentsToken: 'comm'}
    const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    const html = '<p>comments watch fragment</p>'
    const apiResponse = { body: {watch_discussion: html} }

    const getSession = td.replace('../../../lib/youtube-api/session-store')
    const request = td.replace('../../../lib/utils/request')
    const Youtube = require('../../../lib/youtube-api/youtube-api')

    const requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        session_token: session.sessionToken
      }
    })

    td.when(request(requestMatcher))
      .thenReturn(Task.rejected('na-ah'), Task.of(apiResponse))

    td.when(getSession(videoId))
      .thenReturn(Task.of(session))

    t.plan(1)

    Youtube.commentsWatchFragment(videoId, session, request)
        .fork(t.fail,
              res => {
                t.deepEqual(res, apiResponse)
                td.reset()
                t.end()
              })
  })

  t.test('commentsWatchFragment fetches comments watch fragment', t => {
    const videoId = 'videoId'
    const session = {sessionToken: 'sess', commentsToken: 'comm'}
    const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    const html = '<p>comments watch fragment</p>'
    const apiResponse = { body: {watch_discussion: html} }

    const getSession = td.replace('../../../lib/youtube-api/session-store')
    const request = td.replace('../../../lib/utils/request')
    const Youtube = require('../../../lib/youtube-api/youtube-api')

    const requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        session_token: session.sessionToken
      }
    })

    td.when(request(requestMatcher))
      .thenReturn(Task.of(apiResponse))

    td.when(getSession(videoId))
      .thenReturn(Task.of(session))

    t.plan(1)

    Youtube.commentsWatchFragment(videoId, session, request)
        .fork(t.fail,
              res => {
                t.deepEqual(res, apiResponse)
                td.reset()
                t.end()
              })
  })

  // t.test('fetchCommentsWatchFragment is a function', t => {
  //   t.plan(1)
  //   t.equal(typeof fetchCommentsWatchFragment, 'function', 'is a function')
  //   t.end()
  // })
  //
  // t.test('fetchCommentsWatchFragment() throws an error for missing parameters', t => {
  //   t.plan(4)
  //   t.throws(() => fetchCommentsWatchFragment(), /videoId/)
  //   t.throws(() => fetchCommentsWatchFragment('videoid'), /session/)
  //   t.throws(() => fetchCommentsWatchFragment('videoid', {sessionToken: 'token'}), /request/)
  //   t.ok(fetchCommentsWatchFragment('videoId', {sessionToken: 'token'}, () => true))
  //   t.end()
  // })
  //
  // t.test('fetchCommentsWatchFragment() fetches a fetchCommentsWatchFragment', t => {
    // const videoId = 'videoid'
    // const session = { sessionToken: 'sessionToken '}
    // const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    // const form = buildRequestFormData(session)
    // const expectedResult = 'success'
    //
    // const request = td.function('request')
    //
    // td.when(request({
    //   method: 'POST',
    //   json: true,
    //   url,
    // form})).thenReturn(Promise.resolve(expectedResult))
    //
    // return fetchCommentsWatchFragment(videoId, session, request)
    //   .then(result => t.equal(expectedResult, result))
    //   .then(() => td.reset())
  // })
  //
  // t.test('fetchCommentPage is a function', t => {
  //   t.plan(1)
  //   t.equal(typeof fetchCommentPage, 'function', 'is a function')
  //   t.end()
  // })
  //
  // t.test('fetchCommentPage() throws an error for missing parameters', t => {
  //   t.plan(4)
  //   t.throws(() => fetchCommentPage(), /pageToken/)
  //   t.throws(() => fetchCommentPage('pageToken'), /session/)
  //   t.throws(() => fetchCommentPage('pageToken', {sessionToken: 'token'}), /request/)
  //   t.ok(() => fetchCommentPage('pageToken', {sessionToken: 'token'}, () => true))
  //   t.end()
  // })
  //
  // t.test('fetchCommentPage() fetches a comment page', t => {
  //   const pageToken = 'pageToken'
  //   const session = { sessionToken: 'sessionToken '}
  //   const url = buildCommentServiceUrl()
  //   const form = buildRequestFormData(session, pageToken)
  //   const expectedResult = 'success'
  //
  //   const request = td.function('request')
  //
  //   td.when(request({
  //     method: 'POST',
  //     json: true,
  //     url,
  //   form})).thenReturn(Promise.resolve(expectedResult))
  //
  //   return fetchCommentPage(pageToken, session, request)
  //     .then(result => t.equal(expectedResult, result))
  //     .then(() => td.reset())
  // })
})
