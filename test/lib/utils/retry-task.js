const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')

const retry = require('../../../lib/utils/retry-task')

describe('/lib/utils/retry-task.js', () => {
  afterEach(() => {
    td.reset()
  })

  it('exports a function', () => {
    expect(retry).to.be.a('function')
  })

  it('task resolves if fn succeeds immediately', done => {
    const retryTwice = retry(2)
    const value = 'the value'
    const fn = td.function('fn')

    td.when(fn()).thenReturn(Task.of(value))

    retryTwice(fn)
      .fork(
        e => done('got an error ' + e),
        res => {
          expect(res).to.equal(value)
          done()
        })
  })

  it('retry if fn fails', done => {
    const retryThrice = retry(3)
    const errMsg = 'the error'
    const value = 'the value'
    const fn = td.function('fn')

    td.when(fn()).thenReturn(Task.rejected(errMsg), Task.of(value))

    retryThrice(fn)
      .fork(
        e => done('got an error ' + e),
        res => {
          expect(res).to.equal(value)
          done()
        })
  })

  it('task is rejected if number of retries is exceeded', done => {
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
          expect(e).to.equal(errMsg)
          done()
        },
        res => done('expected task to be rejected')
    )
  })
})
