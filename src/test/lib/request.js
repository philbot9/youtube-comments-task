import test from 'blue-tape'

import request, { CookieJar } from '../../lib/request'

test('/lib/request.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof request, 'function', 'is of type object')
    t.end()
  })

  t.test('- exposes CookieJar', t => {
    t.ok(CookieJar, 'CookieJar exported')
    t.ok(CookieJar._jar, 'CookieJar._jar exists')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const returnValue = request().catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.end()
  })

  t.test('- promise is rejected for invalid parameters', t => {
    return request()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
      .then(() => request({nothing: 'here'}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
  })
})
