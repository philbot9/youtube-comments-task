const test = require('tape')
const td = require('testdouble')

const { fetchCommentsWatchFragment, fetchCommentPage } = require('../../../lib/youtube-api/youtube-api')
const { buildWatchFragmentsUrl, buildCommentServiceUrl } = require('../../../lib/youtube-api/url-builder')
const buildRequestFormData = require('../../../lib/youtube-api/build-request-form-data')

const noop = () => {
}

test('/lib/youtube-api-request', t => {
  t.test('fetchCommentsWatchFragment is a function', t => {
    t.plan(1)
    t.equal(typeof fetchCommentsWatchFragment, 'function', 'is a function')
    t.end()
  })

  t.test('fetchCommentsWatchFragment() throws an error for missing parameters', t => {
    t.plan(4)
    t.throws(() => fetchCommentsWatchFragment(), /videoId/)
    t.throws(() => fetchCommentsWatchFragment('videoid'), /session/)
    t.throws(() => fetchCommentsWatchFragment('videoid', {sessionToken: 'token'}), /request/)
    t.ok(fetchCommentsWatchFragment('videoId', {sessionToken: 'token'}, () => true))
    t.end()
  })

  t.test('fetchCommentsWatchFragment() fetches a fetchCommentsWatchFragment', t => {
    const videoId = 'videoid'
    const session = { sessionToken: 'sessionToken '}
    const url = buildWatchFragmentsUrl(videoId, session, ['comments'])
    const form = buildRequestFormData(session)
    const expectedResult = 'success'

    const request = td.function('request')

    td.when(request({
      method: 'POST',
      json: true,
      url,
    form})).thenReturn(Promise.resolve(expectedResult))

    return fetchCommentsWatchFragment(videoId, session, request)
      .then(result => t.equal(expectedResult, result))
      .then(() => td.reset())
  })

  t.test('fetchCommentPage is a function', t => {
    t.plan(1)
    t.equal(typeof fetchCommentPage, 'function', 'is a function')
    t.end()
  })

  t.test('fetchCommentPage() throws an error for missing parameters', t => {
    t.plan(4)
    t.throws(() => fetchCommentPage(), /pageToken/)
    t.throws(() => fetchCommentPage('pageToken'), /session/)
    t.throws(() => fetchCommentPage('pageToken', {sessionToken: 'token'}), /request/)
    t.ok(() => fetchCommentPage('pageToken', {sessionToken: 'token'}, () => true))
    t.end()
  })

  t.test('fetchCommentPage() fetches a comment page', t => {
    const pageToken = 'pageToken'
    const session = { sessionToken: 'sessionToken '}
    const url = buildCommentServiceUrl()
    const form = buildRequestFormData(session, pageToken)
    const expectedResult = 'success'

    const request = td.function('request')

    td.when(request({
      method: 'POST',
      json: true,
      url,
    form})).thenReturn(Promise.resolve(expectedResult))

    return fetchCommentPage(pageToken, session, request)
      .then(result => t.equal(expectedResult, result))
      .then(() => td.reset())
  })
})
