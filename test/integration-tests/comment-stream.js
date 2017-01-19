const { expect } = require('chai')
const cheerio = require('cheerio')

const buildCommentStream = require('../../lib/comment-stream')

describe('/lib/comment-stream', function () {
  this.timeout(30000)
  it('fetches comments', done => {
    const results = []
    buildCommentStream('9bZkp7q19f0')
      .take(100)
      .subscribe({
        next: p => results.push(p),
        error: e => done('got an error ' + e),
        complete: () => {
          expect(results).to.be.an('array').of.length(100)
          results.forEach(c => {
            expect(c).to.have.property('id').that.is.a('string').of.length.at.least(1)
            expect(c).to.have.property('author').that.is.a('string').of.length.at.least(1)
            expect(c).to.have.property('authorLink').that.is.a('string').of.length.at.least(1)
            expect(c).to.have.property('authorThumb').that.is.a('string').of.length.at.least(1)
            expect(c).to.have.property('text').that.is.a('string').of.length.at.least(1)
            expect(c).to.have.property('likes').that.is.a('number').of.at.least(0)
            expect(c).to.have.property('time').that.is.a('string').of.length.at.least(1)
            expect(c).to.have.property('timestamp').that.is.a('number').above(0)
            expect(c).to.have.property('hasReplies').that.is.a('boolean')

            if (c.hasReplies) {
              expect(c).to.have.property('replies').that.is.an('array').of.length(c.numReplies)
              expect(c).to.have.property('numReplies').that.is.a('number').that.is.equal(c.replies.length)
            }
          })
          done()
        }
      })
  })
})
