const test = require('tape')
const cheerio = require('cheerio')
const moment = require('moment')

const parseCommentRenderer = require('../../lib/parse-comment-renderer')

const isWithinRange = require('../is-within-range')
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

test('/lib/parse-comment-renderer.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof parseCommentRenderer, 'function', 'is of type function')
    t.end()
  })

  t.test('- parses simple comment fields', t => {
    const exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: moment().subtract(3, 'months').format('x')
    }

    const html = sampleComment(exp)
    const $commentRenderer = cheerio.load(html)('.comment-thread-renderer > .comment-renderer:nth-child(1)')

    parseCommentRenderer($commentRenderer)
      .fold(t.fail, result => {
        t.equal(result.id, exp.id, 'id is correct')
        t.equal(result.author, exp.author, 'author is correct')
        t.equal(result.authorLink, exp.authorLink, 'author link is correct')
        t.equal(result.authorThumb, exp.authorThumb, 'author thumb is correct')
        t.equal(result.text, exp.text, 'text is correct')
        t.equal(result.likes, exp.likes, 'likes is correct')
        t.equal(result.time, exp.time, 'time is correct is correct')
        t.ok(isWithinRange(result.timestamp, exp.timestamp, (60 * 1000)), 'timestamp is correct')
        t.end()
      })
  })
})
