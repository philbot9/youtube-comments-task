const { expect } = require('chai')
const cheerio = require('cheerio')
const moment = require('moment')

const parseCommentRenderer = require('../../lib/parse-comment-renderer')

const {
  sampleComment,
  COMMENT_ID,
  COMMENT_AUTHOR,
  COMMENT_AUTHOR_LINK,
  COMMENT_AUTHOR_THUMB,
  COMMENT_TIME,
  COMMENT_TEXT,
  COMMENT_LIKES,
  REPLIES_TOKEN
} = require('../sample-comment-html')

describe('/lib/parse-comment-renderer.js', () => {
  it('exports a function', () => {
    expect(parseCommentRenderer).to.be.a('function')
  })

  it('parses simple comment fields', done => {
    const exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: parseInt(moment().subtract(3, 'months').format('x'), 10)
    }

    const html = sampleComment(exp)
    const $commentRenderer = cheerio.load(html)('.comment-thread-renderer > .comment-renderer:nth-child(1)')

    parseCommentRenderer($commentRenderer)
      .fold(e => {
        expect.fail(e)
        done(e)
      }, result => {
        expect(result).to.have.property('id', exp.id)
        expect(result).to.have.property('author', exp.author)
        expect(result).to.have.property('authorLink', exp.authorLink)
        expect(result).to.have.property('authorThumb', exp.authorThumb)
        expect(result).to.have.property('text', exp.text)
        expect(result).to.have.property('likes', exp.likes)
        expect(result).to.have.property('time', exp.time)
        expect(result).to.have.property('timestamp').that.is.a('number').closeTo(exp.timestamp, (60 * 1000))
        done()
      })
  })

  it('handles missing fields on comment', done => {
    const exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: parseInt(moment().subtract(3, 'months').format('x'), 10)
    }
    const html = sampleComment(exp)
    const $commentRenderer = cheerio.load(html)('.comment-thread-renderer > .comment-renderer:nth-child(1)')
    $commentRenderer.removeAttr('data-cid')
    $commentRenderer.find('.comment-author-text').text('')
    $commentRenderer.find('a.comment-author-text').removeAttr('href')
    $commentRenderer.find('.comment-author-thumbnail img').remove()
    $commentRenderer.find('.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').remove()
    $commentRenderer.find('.comment-action-buttons-toolbar > .comment-renderer-like-count.on').remove()
    $commentRenderer.find('.comment-renderer-header > .comment-renderer-time').remove()

    parseCommentRenderer($commentRenderer)
      .fold(e => {
        done(e)
      }, result => {
        expect(result).to.deep.equal({})
        done()
      })
  })
})
