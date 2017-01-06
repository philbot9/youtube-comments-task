const test = require('blue-tape')
const cheerio = require('cheerio')
const moment = require('moment')

const parseComment = require('../../lib/parse-comment')
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

function isWithinRange (v1, v2, range) {
  return v1 > (v2 - range) && v1 < (v2 + range)
}

test('/lib/parse-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof parseComment, 'function', 'is of type function')
    t.end()
  })

  t.test('- parses simple comment fields', t => {
    const time = '3 months ago'
    const expectedTimestamp = moment().subtract(3, 'months').format('x')
    const html = sampleComment({time})

    parseComment(cheerio(html))
      .fold(t.fail, result => {
        t.equal(result.id, COMMENT_ID, 'id is correct')
        t.equal(result.author, COMMENT_AUTHOR, 'author is correct')
        t.equal(result.authorLink, COMMENT_AUTHOR_LINK, 'author link is correct')
        t.equal(result.authorThumb, COMMENT_AUTHOR_THUMB, 'author thumb is correct')
        t.equal(result.text, COMMENT_TEXT, 'text is correct')
        t.equal(result.likes, COMMENT_LIKES, 'comment likes is correct')
        t.equal(result.time, time, 'time is correct is correct')
        t.ok(isWithinRange(result.timestamp, expectedTimestamp, (60 * 1000)), 'timestamp is correct')
        t.equal(result.hasReplies, false, 'hasReplies is false')
        t.end()
      })
  })

//   t.test('- extracts info on replies to comment if applicable', t => {
//     const replies = 4
//     const repliesToken = 'EhYSC2NCVWVpcFhGaXNRwAEAyAEA4AEBGAYyWRpXEiN6MTNrZm4xNW91bXRodmRpNDA0Y2lybWF0dHYwZHoxNG1kayICCAAqGFVDM1hUelZ6YUhRRWQzMHJRYnV2Q3RUUTILY0JVZWlwWEZpc1E4AEABSPQD'
//     const html = sampleComment({replies, repliesToken})
//     const result = parseComment(cheerio(html))
//     t.equal(result.hasReplies, true, 'hasReplies is true')
//     t.equal(result.numReplies, replies, 'numReplies is correct')
//     t.equal(result.repliesToken, repliesToken, 'repliesToken is correct')
//     t.end()
//   })
//
//   t.test('- does not falsely identify replies', t => {
//     const html = sampleComment({replies: 0})
//     const result = parseComment(cheerio(html))
//     t.equal(result.hasReplies, false, 'hasReplies is false')
//     t.equal(result.numReplies, 0, 'numReplies is 0')
//     t.notOk(result.repliesToken, 'repliesToken not defined')
//     t.end()
//   })
})
