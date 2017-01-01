const test = require('blue-tape')
const sinon = require('sinon')
const Rx = require('rxjs')

const prepareRepliesStreamBuilder = require('../../lib/comment-replies-stream')

const noop = () => {}

test('/lib/comment-replies-stream.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof prepareRepliesStreamBuilder, 'function', 'is of type function')
    t.end()
  })

  t.test('- throws an error if dependencies parameter is missing', t => {
    t.throws(() => prepareRepliesStreamBuilder())
    t.throws(() => prepareRepliesStreamBuilder(null))
    t.end()
  })

  t.test('- throws an error if request is missing from dependencies', t => {
    t.throws(() => prepareRepliesStreamBuilder({}))
    t.throws(() => prepareRepliesStreamBuilder({getSession: noop}))
    t.end()
  })

  t.test('- throws an error if getSession is missing from dependencies', t => {
    t.throws(() => prepareRepliesStreamBuilder({}))
    t.throws(() => prepareRepliesStreamBuilder({request: noop}))
    t.end()
  })

  t.test('- returns a stream builder function', t => {
    const result = prepareRepliesStreamBuilder({getSession: noop, request: noop})
    t.equal(typeof result, 'function', 'is of type function')
    t.end()
  })

  t.test('- stream builder throws an error if comment parameter is missing', t=> {
    const buildRepliesStream = prepareRepliesStreamBuilder({getSession: noop, request: noop})
    t.throws(() => buildRepliesStream())
    t.throws(() => buildRepliesStream(null))
    t.end()
  })
})
