const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

const retry = require('../../../lib/utils/retry-task')

test.only('/lib/utils/retry-task.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof retry, 'function', 'is of type function')
    t.end()
  })

  t.test('- task resolves if fn succeeds immediately', t => {
    const retryTwice = retry(2)
    const value = 'the value'
    const fn = td.function('fn')

    td.when(fn()).thenReturn(Task.of(value))

    retryTwice(fn)
      .fork(
        t.notOk,
        res => {
          t.equal(value, res, 'result is correct')
          t.end()
        })
  })

  t.test('- retry if fn fails', t => {
    const retryThrice = retry(3)
    const errMsg = 'the error'
    const value = 'the value'
    const fn = td.function('fn')

    td.when(fn()).thenReturn(Task.rejected(errMsg), Task.of(value))

    retryThrice(fn)
      .fork(
        t.notOk,
        res => {
          t.equal(res, value, 'result is correct')
          t.end()
        })
  })

  t.test('- task is rejected if number of retries is exceeded', t => {
    const retryTwice = retry(2)
    const errMsg = 'the error'
    const value = 'value'
    const fn = td.function('fn')

    td.when(fn()).thenReturn(
      Task.rejected(errMsg),
      Task.rejected(errMsg),
      Task.rejected(errMsg),
      Task.of(value))

    retryTwice(fn)
      .fork(
        e => {
          t.equal(errMsg, e, 'error message is correct')
          t.end()
        },
        t.notOk
      )
  })

  // t.test('- promise is rejected if fn parameter is missing', t => {
  //   return retry()
  //     .then(() => t.fail('Promise should not resolve'))
  //     .catch((err) => t.ok(true, 'got an error'))
  //     .then(() => retry(null))
  //     .then(() => t.fail('Promise should not resolve'))
  //     .catch((err) => t.ok(true, 'got an error'))
  //     .then(() => retry(null, 2))
  //     .then(() => t.fail('Promise should not resolve'))
  //     .catch((err) => t.ok(true, 'got an error'))
  // })
  //
  // t.test('- promise resolves if fn succeeds immediately', t => {
  //   const value = 'the_value'
  //   const fn = sinon.stub().returns(Promise.resolve(value))
  //
  //   return retry(fn)
  //     .then((result) => {
  //       t.ok(fn.calledOnce, 'fn called once')
  //       t.equal(result, value, 'result is correct')
  //     })
  // })
  //
  // t.test('- fn is retried once by default', t => {
  //   const value = 'the_value'
  //   const fn = sinon.stub()
  //   fn.onCall(0).returns(Promise.reject())
  //   fn.onCall(1).returns(Promise.resolve(value))
  //
  //   return retry(fn)
  //     .then((result) => {
  //       t.ok(fn.calledTwice, 'fn called twice')
  //       t.equal(result, value, 'result is correct')
  //     })
  // })
  //
  // t.test('- number of retries can be defined', t => {
  //   const value = 'the_value'
  //   const fn = sinon.stub()
  //   fn.onCall(0).returns(Promise.reject())
  //   fn.onCall(1).returns(Promise.reject())
  //   fn.onCall(2).returns(Promise.reject())
  //   fn.onCall(3).returns(Promise.resolve(value))
  //
  //   return retry(fn, 3)
  //     .then((result) => {
  //       t.equal(fn.callCount, 4, 'fn called four times')
  //       t.equal(result, value, 'result is correct')
  //     })
  // })
  //
  // t.test('- promise is rejected if fn still fails after default number of retries', t => {
  //   const errMsg = 'error message'
  //   const fn = sinon.stub()
  //   fn.onCall(0).returns(Promise.reject(errMsg))
  //   fn.onCall(1).returns(Promise.reject(errMsg))
  //
  //   return retry(fn)
  //     .then(() => t.fail('promise should not resolve'))
  //     .catch(err => t.equal(err, errMsg, 'rejects with correct error'))
  // })
  //
  // t.test('- promise is rejected if fn still fails after defined number of retries', t => {
  //   const errMsg = 'error message'
  //   const fn = sinon.stub()
  //   fn.onCall(0).returns(Promise.reject(errMsg))
  //   fn.onCall(1).returns(Promise.reject(errMsg))
  //   fn.onCall(2).returns(Promise.reject(errMsg))
  //   fn.onCall(3).returns(Promise.reject(errMsg))
  //
  //   return retry(fn, 3)
  //     .then(() => t.fail('promise should not resolve'))
  //     .catch(err => t.equal(err, errMsg, 'rejects with correct error'))
  // })
})
