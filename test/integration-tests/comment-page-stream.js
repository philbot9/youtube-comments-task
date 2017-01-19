const { expect } = require('chai')
const cheerio = require('cheerio')

const buildCommentPageStream = require('../../lib/comment-page-stream')

describe('/lib/comment-page-stream', function () {
  this.timeout(10000)
  it('fetches comment pages', function (done) {
    const results = []
    buildCommentPageStream('9bZkp7q19f0')
      .take(3)
      .subscribe({
        next: p => results.push(p),
        error: e => done('got an error ' + e),
        complete: () => {
          expect(results).to.be.an('array').of.length(3)
          results.forEach(html => {
            const $ = cheerio.load(html)
            expect($('.comment-thread-renderer').length).to.be.above(1)
            expect($('.comment-renderer').length).to.be.above(1)
          })
          done()
        }
      })
  })
})
