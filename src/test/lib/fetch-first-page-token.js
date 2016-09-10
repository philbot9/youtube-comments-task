import test from 'blue-tape'
import sinon from 'sinon'

import fetchFirstPageToken, {
  fetchCommentFragment,
  extractPageToken
} from '../../lib/fetch-first-page-token'

test('/lib/fetch-first-page-token.js', t => {
  t.test('- module exports a function', t => {
    t.equal(typeof fetchFirstPageToken, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const returnValue = fetchFirstPageToken().catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is a function')
    t.end()
  })

  t.test('- requires a videoId parameter', t => {
    return fetchFirstPageToken()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
      .then(() => fetchFirstPageToken(null, {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
  })

  t.test('- requires a session parameter', t => {
    return fetchFirstPageToken()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
      .then(() => fetchFirstPageToken('videoId'))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
  })


})
