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

  it('Task is rejected for invalid URLs', function (done) {
    this.timeout(10000)

    request().fork(
      e => {
        expect(e).to.exist
        request('http://nosuchdomain.fake').fork(
          e => {
            expect(e).to.exist
            done()
          },
          r => done('expected task to fail')
        )
      },
      r => done('expected task to fail')
    )
  })

  it('Task is rejected for invalid status codes', function (done) {
    this.timeout(10000)

    request('http://google.com/no/such/path').fork(
      e => {
        expect(e).to.exist
        done()
      },
      r => done('expected task to fail')
    )
  })

  it('Task is fulfilled for valid requests', function (done) {
    this.timeout(10000)

    request('http://www.google.com/').fork(
      e => done(`got an error ${e}`),
      x => {
        expect(x).to.be.a('string').of.length.above(500)
        expect(x).to.match(/<html/i)
        done()
      }
    )
  })
})
