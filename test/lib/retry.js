const test = require('blue-tape')
const sinon = require('sinon')

const retry = require('../../lib/retry')

test('/lib/retry.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof retry, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const returnValue = retry().catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.end()
  })

  t.test('- promise is rejected if fn parameter is missing', t => {
    return retry()
      .then(() => t.fail('Promise should not resolve'))
      .catch((err) => t.ok(true, 'got an error'))
      .then(() => retry(null))
      .then(() => t.fail('Promise should not resolve'))
      .catch((err) => t.ok(true, 'got an error'))
      .then(() => retry(null, 2))
      .then(() => t.fail('Promise should not resolve'))
      .catch((err) => t.ok(true, 'got an error'))
  })

  t.test('- promise resolves if fn succeeds immediately', t => {
    const value = 'the_value'
    const fn = sinon.stub().returns(Promise.resolve(value))

    return retry(fn)
      .then((result) => {
        t.ok(fn.calledOnce, 'fn called once')
        t.equal(result, value, 'result is correct')
      })
  })

  t.test('- fn is retried once by default', t => {
    const value = 'the_value'
    const fn = sinon.stub()
    fn.onCall(0).returns(Promise.reject())
    fn.onCall(1).returns(Promise.resolve(value))

    return retry(fn)
      .then((result) => {
        t.ok(fn.calledTwice, 'fn called twice')
        t.equal(result, value, 'result is correct')
      })
  })

  t.test('- number of retries can be defined', t => {
    const value = 'the_value'
    const fn = sinon.stub()
    fn.onCall(0).returns(Promise.reject())
    fn.onCall(1).returns(Promise.reject())
    fn.onCall(2).returns(Promise.reject())
    fn.onCall(3).returns(Promise.resolve(value))

    return retry(fn, 3)
      .then((result) => {
        t.equal(fn.callCount, 4, 'fn called four times')
        t.equal(result, value, 'result is correct')
      })
  })

  t.test('- promise is rejected if fn still fails after default number of retries', t => {
    const errMsg = 'error message'
    const fn = sinon.stub()
    fn.onCall(0).returns(Promise.reject(errMsg))
    fn.onCall(1).returns(Promise.reject(errMsg))

    return retry(fn)
      .then(() => t.fail('promise should not resolve'))
      .catch(err => t.equal(err, errMsg, 'rejects with correct error'))
  })

  t.test('- promise is rejected if fn still fails after defined number of retries', t => {
    const errMsg = 'error message'
    const fn = sinon.stub()
    fn.onCall(0).returns(Promise.reject(errMsg))
    fn.onCall(1).returns(Promise.reject(errMsg))
    fn.onCall(2).returns(Promise.reject(errMsg))
    fn.onCall(3).returns(Promise.reject(errMsg))

    return retry(fn, 3)
      .then(() => t.fail('promise should not resolve'))
      .catch(err => t.equal(err, errMsg, 'rejects with correct error'))
  })
})
