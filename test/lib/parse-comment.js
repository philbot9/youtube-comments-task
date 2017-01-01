const test = require('blue-tape')
const sinon = require('sinon')
const cheerio = require('cheerio')
const moment = require('moment')

const parseComment = require('../../lib/parse-comment')
const {
  sampleComment,
  COMMENT_ID,
  COMMENT_USER,
  COMMENT_FROMNOW,
  COMMENT_TEXT,
  COMMENT_LIKES,
  REPLY_ID,
  REPLY_USER
} = require('../sample-comment-html')

function isWithinRange (v1, v2, range) {
  return v1 > (v2 - range) && v1 < (v2 + range)
}

test('/lib/parse-comment-page.js', t => {
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

  t.test('- extracts info on replies to comment if applicable', t => {
    const replies = 4
    const repliesToken = 'EhYSC2NCVWVpcFhGaXNRwAEAyAEA4AEBGAYyWRpXEiN6MTNrZm4xNW91bXRodmRpNDA0Y2lybWF0dHYwZHoxNG1kayICCAAqGFVDM1hUelZ6YUhRRWQzMHJRYnV2Q3RUUTILY0JVZWlwWEZpc1E4AEABSPQD'
    const html = sampleComment({replies, repliesToken})
    const result = parseComment(cheerio(html))
    t.equal(result.hasReplies, true, 'hasReplies is true')
    t.equal(result.numReplies, replies, 'numReplies is correct')
    t.equal(result.repliesToken, repliesToken, 'repliesToken is correct')
    t.end()
  })

  t.test('- does not falsely identify replies', t => {
    const html = sampleComment({replies: 0})
    const result = parseComment(cheerio(html))
    t.equal(result.hasReplies, false, 'hasReplies is false')
    t.equal(result.numReplies, 0, 'numReplies is 0')
    t.notOk(result.repliesToken, 'repliesToken not defined')
    t.end()
  })
})
