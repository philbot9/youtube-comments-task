const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')

const {
  buildWatchFragmentsUrl,
  buildCommentServiceUrl
} = require('../../../lib/youtube-api/url-builder')

describe('/lib/youtube-api/youtube-api', () => {
  afterEach(() => {
    td.reset()
  })

  it('module exports an object', () => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    expect(Youtube).to.be.a('object')
  })

  it('commentPage is a function on the object', () => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    expect(Youtube).to.have.property('commentPage').that.is.a('function')
  })

  it('commentPage fetches comment page', done => {
    const videoId = 'videoId'
    const pageToken = 'pageToken'
    const url = buildCommentServiceUrl('action_get_comments')
    const html = '<p>comment page</p>'
    const apiResponse = { content_html: html }
    const session = { sessionToken: 'sess', commentsToken: 'comm' }

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

    td.when(request(requestMatcher)).thenReturn(Task.of(apiResponse))

    td.when(getSession(videoId)).thenReturn(Task.of(session))

    Youtube.commentPage(videoId, pageToken).fork(
      e => done('got error ' + e),
      res => {
        expect(res).to.deep.equal(apiResponse)
        done()
      }
    )
  })

  it('commentPage will re-fetch if first attempt fails', done => {
    const videoId = 'videoId'
    const pageToken = 'pageToken'
    const url = buildCommentServiceUrl('action_get_comments')
    const html = '<p>comment page</p>'
    const apiResponse = { content_html: html }
    const session = { sessionToken: 'sess', commentsToken: 'comm' }

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

    td
      .when(request(requestMatcher))
      .thenReturn(Task.rejected('na-ah'), Task.of(apiResponse))

    td.when(getSession(videoId)).thenReturn(Task.of(session))

    Youtube.commentPage(videoId, pageToken).fork(
      e => done('got error ' + e),
      res => {
        expect(res).to.deep.equal(apiResponse)
        done()
      }
    )
  })

  it('commentReplies is a function on the object', () => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    expect(Youtube).to.have.property('commentReplies').that.is.a('function')
  })

  it('commentReplies fetches comment replies', done => {
    const videoId = 'videoId'
    const repliesToken = 'repliesToken'
    const url = buildCommentServiceUrl('action_get_comment_replies')
    const html = '<p>replies content</p>'
    const apiResponse = { content_html: html }
    const session = { sessionToken: 'sess', commentsToken: 'comm' }

    const getSession = td.replace('../../../lib/youtube-api/session-store')
    const request = td.replace('../../../lib/utils/request')
    const Youtube = require('../../../lib/youtube-api/youtube-api')

    const requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: repliesToken,
        session_token: session.sessionToken
      }
    })

    td.when(request(requestMatcher)).thenReturn(Task.of(apiResponse))

    td.when(getSession(videoId)).thenReturn(Task.of(session))

    Youtube.commentReplies(videoId, repliesToken).fork(
      e => done('got an error ' + e),
      res => {
        expect(res).to.deep.equal(apiResponse)
        done()
      }
    )
  })

  it('commentReplies will re-fetch if first attempt fails', done => {
    const videoId = 'videoId'
    const repliesToken = 'repliesToken'
    const url = buildCommentServiceUrl('action_get_comment_replies')
    const html = '<p>comment page</p>'
    const apiResponse = { content_html: html }
    const session = { sessionToken: 'sess', commentsToken: 'comm' }

    const getSession = td.replace('../../../lib/youtube-api/session-store')
    const request = td.replace('../../../lib/utils/request')
    const Youtube = require('../../../lib/youtube-api/youtube-api')

    const requestMatcher = td.matchers.contains({
      method: 'POST',
      url: url,
      json: true,
      form: {
        page_token: repliesToken,
        session_token: session.sessionToken
      }
    })

    td
      .when(request(requestMatcher))
      .thenReturn(Task.rejected('na-ah'), Task.of(apiResponse))

    td.when(getSession(videoId)).thenReturn(Task.of(session))

    Youtube.commentReplies(videoId, repliesToken).fork(
      e => done('got an error ' + e),
      res => {
        expect(res).to.deep.equal(apiResponse)
        done()
      }
    )
  })

  it('commentsWatchFragment is a function on the object', () => {
    const Youtube = require('../../../lib/youtube-api/youtube-api')
    expect(Youtube).to.have
      .property('commentsWatchFragment')
      .that.is.a('function')
  })

  it('commentsWatchFragment fetches comments watch fragment', done => {
    const videoId = 'videoId'
    const session = { sessionToken: 'sess', commentsToken: 'comm' }
    const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    const html = '<p>comments watch fragment</p>'
    const apiResponse = { body: { watch_discussion: html } }

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

    td
      .when(request(requestMatcher))
      .thenReturn(Task.rejected('na-ah'), Task.of(apiResponse))

    td.when(getSession(videoId)).thenReturn(Task.of(session))

    Youtube.commentsWatchFragment(videoId, session, request).fork(
      e => done('got an error ' + e),
      res => {
        expect(res).to.deep.equal(apiResponse)
        done()
      }
    )
  })

  it('commentsWatchFragment re-fetches if fetch fails', done => {
    const videoId = 'videoId'
    const session = { sessionToken: 'sess', commentsToken: 'comm' }
    const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    const html = '<p>comments watch fragment</p>'
    const apiResponse = { body: { watch_discussion: html } }

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

    td
      .when(request(requestMatcher))
      .thenReturn(Task.rejected('na-ah'), Task.of(apiResponse))

    td.when(getSession(videoId)).thenReturn(Task.of(session))

    Youtube.commentsWatchFragment(videoId, session, request).fork(
      e => done('got an error ' + e),
      res => {
        expect(res).to.deep.equal(apiResponse)
        done()
      }
    )
  })
})
