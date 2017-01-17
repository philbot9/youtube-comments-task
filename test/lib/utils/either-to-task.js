const test = require('tape')
const Task = require('data.task')
const Either = require('data.either')

const eitherToTask = require('../../../lib/utils/either-to-task')

test('/lib/utils/request.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof eitherToTask, 'function', 'is of type function')
    t.end()
  })

  t.test('- transforms an Either.Right to a rejected Task', t => {
    const value = 'value'
    eitherToTask(Either.of(value))
      .fork(t.fail, v => {
        t.equal(v, value, 'value is the same')
        t.end()
      })
  })

  t.test('- transforms an Either.Left to a successful Task', t => {
    const value = 'value'
    eitherToTask(Either.Left(value))
      .fork(v => {
        t.equal(v, value, 'value is the same')
        t.end()
      }, t.fail)
  })

  t.test('- natural transformation property holds', t => {
    const e = Either.of(1)
    const f = x => x + 1

    eitherToTask(e).map(f).fork(t.fail, r1 => {
      eitherToTask(e.map(f)).fork(t.fail, r2 => {
        t.equal(r1, 2)
        t.equal(r2, 2)
        t.end()
      })
    })
  })
})
