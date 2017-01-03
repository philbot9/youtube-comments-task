const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

const retry = require('../../../lib/utils/retry-task')

test('/lib/utils/retry-task.js', t => {
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
})
