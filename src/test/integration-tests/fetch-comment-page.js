const { expect } = require('chai')
const cheerio = require('cheerio')

const fetchCommentPage = require('../../lib/fetch-comment-page')
const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

describe('/lib/fetch-comment-page', function () {
  this.timeout(10000)
  it('fetches a comment page', function (done) {
    const videoId = '9bZkp7q19f0'
    fetchFirstPageToken(videoId)
      .chain(t => fetchCommentPage(videoId, t))
      .fork(e => done('got an error' + e), p => {
        expect(p).to.have.property('commentHtml').that.is.a('string').of.length.above(1)
        expect(p).to.have.property('nextPageToken').that.is.a('string').of.length.above(1)

        const $ = cheerio.load(p.commentHtml)
        expect($('.comment-thread-renderer').length).to.be.above(1)
        expect($('.comment-renderer').length).to.be.above(1)
        done()
      })
  })
})
