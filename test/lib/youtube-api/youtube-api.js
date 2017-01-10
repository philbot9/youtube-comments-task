const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('../../../lib/youtube-api/url-builder')

test('/lib/youtube-api/youtube-api', t => {
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
})
