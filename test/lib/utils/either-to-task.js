const { expect } = require('chai')
const Task = require('data.task')
const Either = require('data.either')

const eitherToTask = require('../../../lib/utils/either-to-task')

describe('/lib/utils/request.js', () => {
  it('exports a function', () => {
    expect(eitherToTask).to.be.a('function')
  })

  it('transforms an Either.Right to a rejected Task', done => {
    const value = 'value'
    eitherToTask(Either.of(value))
      .fork(e => done('got an error ' + e),
            v => {
              expect(v).to.equal(value)
              done()
            })
  })

  it('transforms an Either.Left to a successful Task', done => {
    const value = 'value'
    eitherToTask(Either.Left(value))
      .fork(v => {
        expect(v).to.equal(value)
        done()
      }, res => done('expected task to fail'))
  })

  it('natural transformation property holds', done => {
    const e = Either.of(1)
    const f = x => x + 1

    eitherToTask(e).map(f).fork(e => done('got an error ' + e), r1 => {
      eitherToTask(e.map(f)).fork(e => done('got an error ' + e), r2 => {
        expect(r1).to.equal(2)
        expect(r2).to.equal(2)
        done()
      })
    })
  })
})
