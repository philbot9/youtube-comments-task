const { expect } = require('chai')

const fetchReplies = require('../../lib/fetch-replies')

describe('/lib/fetch-replies', function () {
  this.timeout(10000)

  it('fetches replies', done => {
    const comment = {repliesToken: 'EhYSC3M2TXdHZU9tOGlJwAEAyAEA4AEBGAYyWRpXEiN6MTIxenBwaGVzbTF1cGg0eTA0Y2YxZzV0bHllamRzajAzayICCAAqGFVDM1hUelZ6YUhRRWQzMHJRYnV2Q3RUUTILczZNd0dlT204aUk4AEABSPQD'}
    fetchReplies('s6MwGeOm8iI', comment)
      .fork(e => done('got an error: ' + e),
        rs => {
          expect(rs).to.be.an('array').of.length.above(0)
          rs.forEach(r => {
            expect(r).to.have.property('id').that.is.a('string')
            expect(r).to.have.property('author').that.is.a('string')
            expect(r).to.have.property('authorLink').that.is.a('string')
            expect(r).to.have.property('authorThumb').that.is.a('string')
            expect(r).to.have.property('text').that.is.a('string')
            expect(r).to.have.property('likes').that.is.a('number').at.least(0)
            expect(r).to.have.property('time').that.is.a('string')
            expect(r).to.have.property('timestamp').that.is.a('number').above(0)
            expect(r).to.have.property('edited').that.is.a('boolean')
          })
          done()
        })
  })
})
