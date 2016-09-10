import test from 'blue-tape'
import sinon from 'sinon'

import fetchCommentPage, {
  URL_TEMPLATE,
  buildFormData,
  fetchPage
} from '../../lib/fetch-comment-page'

test('/lib/fetch-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof fetchCommentPage, 'function', 'is of type function')
    t.end()
  })

  t.test('- throws an error if videoId is missing', t => {
    t.throws(() => fetchCommentPage())
    t.throws(() => fetchCommentPage({getSessionToken: () => {}}))
    t.end()
  })

  t.test('- throws an error if getSessionToken is missing', t => {
    t.throws(() => fetchCommentPage())
    t.throws(() => fetchCommentPage({videoId: () => 'fakeVideoId'}))
    t.end()
  })

  t.test('- function returns a promise', t => {
    const getSessionToken = () => Promise.resolve()
    const videoId = 'fakeVideoId'

    const returnValue = fetchCommentPage({videoId, getSessionToken})
    t.ok(returnValue instanceof Promise, 'instance of Promise')
    t.end()
  })

  t.test('- gets a session token', t => {
    const sessionToken = 'fake_token'
    const videoId = 'fake_video'
    const getSessionToken = sinon.stub().returns(Promise.resolve(sessionToken))

    return fetchCommentPage({ videoId, getSessionToken })
      .catch(() => {})
      .then(() => {
        t.ok(getSessionToken.calledOnce, 'get session token once')
        t.ok(getSessionToken.calledWith(videoId), 'get session token for correct video id')
      })
  })

  t.test('- builds form data without a page token', t => {
    const sessionToken = 'fake_token'
    const videoId = 'fake_video'

    const formData = buildFormData({ sessionToken, videoId })
    t.deepEqual(formData, { session_token: sessionToken, video_id: videoId })
    t.end()
  })

  t.test('- builds form data with a page token', t => {
    const sessionToken = 'fake_token'
    const videoId = 'fake_video'
    const pageToken = 'fake_page_token'

    const formData = buildFormData({ sessionToken, videoId , pageToken})
    t.deepEqual(formData, { session_token: sessionToken, page_token: pageToken })
    t.end()
  })

  t.test('- fetches a comment page', t => {
    const sessionToken = 'fake_token'
    const videoId = 'fake_video'
    const html = '<html></html>'
    const url = URL_TEMPLATE.replace('{{videoId}}', videoId)
    const formData = {
      session_token: sessionToken,
      video_id: videoId
    }
    const request = sinon.stub().returns(Promise.resolve(html))

    return fetchPage({ request, formData, videoId })
      .then(result => {
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
