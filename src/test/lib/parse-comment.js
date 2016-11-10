import test from 'blue-tape'
import sinon from 'sinon'
import cheerio from 'cheerio'
import moment from 'moment'

import parseComment from '../../lib/parse-comment'
import sampleComment, {
  COMMENT_ID,
  COMMENT_USER,
  COMMENT_FROMNOW,
  COMMENT_TEXT,
  COMMENT_LIKES,
  REPLY_ID,
  REPLY_USER
} from '../sample-comment-html'

function isWithinRange (v1, v2, range) {
  return v1 > (v2 - range) && v1 < (v2 + range)
}

test.only('/lib/parse-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof parseComment, 'function', 'is of type function')
    t.end()
  })

  t.test('- parses simple comment fields', t => {
    const fromNow = '1 day ago'
    const expectedTimestamp = moment().subtract(1, 'd').valueOf()

    const html = sampleComment({fromNow})
    const result = parseComment(cheerio(html))

    t.equal(result.id, COMMENT_ID, 'id is correct')
    t.equal(result.hasReplies, false, 'hasReplies is false')
    t.equal(result.user, COMMENT_USER, 'user is correct')
    t.equal(result.text, COMMENT_TEXT, 'comment text is correct')
    t.equal(result.likes, COMMENT_LIKES, 'comment likes is correct')
    t.equal(result.fromNow, fromNow, 'fromNow is correct')
    t.ok(isWithinRange(result.timestamp, expectedTimestamp, (60 * 1000)), 'timestamp is correct')
    t.end()
  })

  t.test('- detects if a comment has replies', t => {
    const html = sampleComment({replies: [{id: REPLY_ID, user: REPLY_USER}]})
    const result = parseComment(cheerio(html))
    t.equal(result.hasReplies, true, 'hasReplies is true')
    t.end()
  })
})
