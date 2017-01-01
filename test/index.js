const test = require('blue-tape')
const Rx = require('rxjs')

const commentStream = require('../index')

test('/index.js', t => {
  t.test(' - returns an Rx Observable', t => {
    const stream = commentStream('videoId')
    t.ok(stream instanceof Rx.Observable, 'instance of Rx.Observable')
    t.end()
  })
})
