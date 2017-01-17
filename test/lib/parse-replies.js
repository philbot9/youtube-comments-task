const test = require('tape')
const cheerio = require('cheerio')
const moment = require('moment')

const parseReplies = require('../../lib/parse-replies')

const isWithinRange = require('../is-within-range')
const { sampleComment } = require('../sample-comment-html')

const validateComment = (t, comment, exp) => {
  t.equal(comment.id, exp.id, 'id is correct')
  t.equal(comment.author, exp.author, 'author is correct')
  t.equal(comment.authorLink, exp.authorLink, 'author link is correct')
  t.equal(comment.authorThumb, exp.authorThumb, 'author thumb is correct')
  t.equal(comment.text, exp.text, 'text is correct')
  t.equal(comment.likes, exp.likes, 'comment likes is correct')
  t.equal(comment.time, exp.time, 'time is correct is correct')
  t.ok(isWithinRange(comment.timestamp, exp.timestamp, (60 * 1000)), 'timestamp is correct')
}

test('/lib/parse-replies.js', t => {
  t.test('- parses replies', t => {
    const replies = [
      {
        id: 'commentid.reply1id',
        author: 'reply1_author',
        authorLink: 'reply1_author_link',
        authorThumb: 'reply1_author_thumb',
        text: 'reply1_text',
        likes: 10,
        time: '10 hours ago',
        timestamp: moment().subtract(10, 'hours').format('x')
      },
      {
        id: 'commentid.reply2id',
        author: 'reply2_author',
        authorLink: 'reply2_author_link',
        authorThumb: 'reply2_author_thumb',
        text: 'reply2_text',
        likes: 0,
        time: '2 minutes ago',
        timestamp: moment().subtract(2, 'minutes').format('x')
      }
    ]

    const html = sampleComment({}, replies)
    const $replies = cheerio(html).find('.comment-replies-renderer')

    parseReplies($replies)
      .fold(t.fail, result => {
        t.ok(typeof replies, 'object', 'result contains replies array')
        t.equal(replies.length, 2, 'array contains correct number of replies')
        result.forEach((r, i) => validateComment(t, r, replies[i]))
        t.end()
      })
  })
})
