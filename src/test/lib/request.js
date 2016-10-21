import test from 'blue-tape'

import buildRequest, { CookieJar } from '../../lib/request'

test('/lib/request.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof buildRequest, 'function', 'is of type function')
    t.end()
  })

  t.test('- exposes CookieJar', t => {
    t.ok(CookieJar, 'CookieJar exported')
    t.ok(CookieJar._jar, 'CookieJar._jar exists')
    t.end()
  })

  t.test('- function returns a function', t => {
    const request = buildRequest()
    t.equal(typeof request, 'function', 'is of type function')
    t.end()
  })

  t.test('- returned function returns a promise', t => {
    const request = buildRequest()
    const returnValue = request('http://www.google.com')
    t.ok(returnValue.then, 'return value has .then')
    t.end()
  })

  t.test('- promise is rejected for invalid parameters', t => {
    const request = buildRequest()
    return request()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
      .then(() => request({nothing: 'here'}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => t.ok(err, 'promise rejected with an error'))
  })
})
