import test from 'blue-tape'
import sinon from 'sinon'
import cheerio from 'cheerio'

import parseComment from '../../lib/parse-comment'
import sampleComment, { COMMENT_ID, COMMENT_USER, REPLY_ID, REPLY_USER } from '../sample-comment-html'

test.only('/lib/parse-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof parseComment, 'function', 'is of type function')
    t.end()
  })

  t.test('- parses simple comment fields', t => {
    const html = sampleComment()
    const result = parseComment(cheerio(html))
    t.equal(result.id, COMMENT_ID, 'id is correct')
    t.equal(result.user, COMMENT_USER, 'user is correct')
    t.equal(result.hasReplies, false, 'hasReplies is false')
    //t.equal(result.date, ...)
    t.end()
  })

  t.test('- detects if a comment has replies', t => {
    const html = sampleComment({replies: [{id: REPLY_ID, user: REPLY_USER}]})
    const result = parseComment(cheerio(html))
    t.equal(result.hasReplies, true, 'hasReplies is true')
    t.end()
  })
})
