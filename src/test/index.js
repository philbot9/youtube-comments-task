import test from 'blue-tape'
import Rx from 'rx'

import commentStream from '../index'

test('/index.js', t => {
  t.test(' - returns an Rx Observable', t => {
    const stream = commentStream()
    t.ok(stream instanceof Rx.Observable, 'instance of Rx.Observable')
    t.end()
  })
})
