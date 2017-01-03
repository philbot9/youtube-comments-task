const test = require('blue-tape')
const Task = require('data.task')

const request = require('../../../lib/utils/request')

test('/lib/utils/request.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof request, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a Task', t => {
    t.ok(request() instanceof Task, 'is instance of Task')
    t.end()
  })

  t.test(' - fetches a url', t => {
    request('http://www.google.com/')
      .fork(t.notOk,
            html => {
              t.ok(html, 'result exists')
              t.end()
            })
  })

  t.test('- Task is rejected for invalid inputs', t => {
    request()
      .fork(e => {
        t.ok(e, 'rejected with an error')
        request('http://nosuchdomain.fake')
          .fork(e => {
            t.ok(e, 'rejected with an error')
            t.end()
          }, t.notOk)
      }, t.notOk)
  })
})
