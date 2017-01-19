const { expect } = require('chai')
const Task = require('data.task')

const request = require('../../../lib/utils/request')

describe('/lib/utils/request.js', () => {
  it('exports a function', () => {
    expect(request).to.be.a('function')
  })

  it('function returns a Task', () => {
    expect(request()).to.be.instanceof(Task)
  })

  it('Task is rejected for invalid inputs', done => {
    request()
      .fork(e => {
        expect(e).to.exist
        request('http://nosuchdomain.fake')
          .fork(e => {
            expect(e).to.exist
            done()
          }, r => done('expected task to fail'))
      }, r => done('expected task to fail'))
  })
})
