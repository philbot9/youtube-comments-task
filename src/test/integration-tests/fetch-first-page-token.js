const { expect } = require('chai')

const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

describe('/lib/fetch-first-page-token', function () {
  this.timeout(10000)

  it('fetches the first page token', done => {
    fetchFirstPageToken('h_tkIpwbsxY').fork(
      e => done('got an error ' + e),
      t => {
        expect(t).to.be.a('string').of.length(64).that.match(/[\w\d]+=$/)
        done()
      }
    )
  })
})
