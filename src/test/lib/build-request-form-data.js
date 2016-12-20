import test from 'blue-tape'

import buildRequestFormData from '../../lib/build-request-form-data'

test('/lib/build-request-form-data.js', t => {
  t.test('- throws an error if session is missing', t => {
    t.throws(() => buildRequestFormData())
    t.throws(() => buildRequestFormData(null, 'pageToken'))
    t.end()
  })

  t.test('throws an error if sessionToken is missing from session', t => {
    t.throws(() => buildRequestFormData({}, 'pageToken'))
    t.throws(() => buildRequestFormData({commentsToken: 'commentsToken'}, 'pageToken'))
    t.end()
  })

  t.test('throws an error if pageToken is missing', t => {
    t.throws(() => buildRequestFormData())
    t.throws(() => buildRequestFormData({}))
    t.end()
  })

  t.test('builds form data', t => {
    const sessionToken = 'fake_token'
    const commentsToken = 'commentsToken'
    const session = { sessionToken, commentsToken }
    const pageToken = 'page_token'

    const formData = buildRequestFormData(session, pageToken)
    t.deepEqual(formData, { session_token: sessionToken, page_token: pageToken })
    t.end()
  })
})
