import test from 'blue-tape'

import request from '../../lib/request'

test('/lib/request.js', t => {
  t.test(' - exports an object', t => {
    t.equal(typeof request, 'object', 'is of type object')
    t.end()
  })

  t.test(' - public interface', t => {
    t.ok(request.get, 'has get')
    t.equal(typeof request.get, 'function', 'get is a function')

    t.ok(request.get, 'has post')
    t.equal(typeof request.post, 'function', 'post is a function')

    t.ok(request.get, 'has CookieJar')
    t.equal(typeof request.CookieJar, 'object', 'CookieJar is an object')
    t.ok(request.CookieJar._jar, 'CookieJar._jar exists')

    t.end()
  })
})
