const test = require('blue-tape')
const Rx = require('rxjs')

const buildCommentPageStream = require('../../lib/comment-page-stream')
const { buildCommentServiceUrl } = require('../../lib/url-builder')

const noop = () => {}

test('/lib/comment-page-stream.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof buildCommentPageStream, 'function', 'is of type function')
    t.end()
  })

  t.test('- throws an error if videoId parameter is missing', t => {
    t.throws(() => buildCommentPageStream())
    t.throws(() => buildCommentPageStream(null, {}))
    t.end()
  })

  t.test('- throws an error if dependencies parameter is missing', t => {
    t.throws(() => buildCommentPageStream())
    t.throws(() => buildCommentPageStream('videoId', null))
    t.end()
  })

  t.test('- throws an error if getSession is missing from dependencies parameter', t => {
    t.throws(() => buildCommentPageStream('videoId', {request: noop}), /getSession/)
    t.throws(() => buildCommentPageStream('videoId', {request: noop, getSession: null}), /getSession/)
    t.end()
  })

  t.test('- throws an error if request is missing from dependencies parameter', t => {
    t.throws(() => buildCommentPageStream('videoId', {getSession: noop}), /request/)
    t.throws(() => buildCommentPageStream('videoId', {getSession: noop, request: null}), /request/)
    t.end()
  })

  t.test('- returns an Rx Observable', t => {
    const dependencies = { getSession: noop, request: noop}
    const returnValue = buildCommentPageStream('videoId', dependencies)
    t.ok(returnValue instanceof Rx.Observable, 'is an instance of Rx.Observable')
    t.end()
  })

  t.test('- Tests are complete', t => {
    t.ok(false, 'TESTS ARE INCOMPLETE!')
    t.end()
  })

})
