const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')
const moment = require('moment')

const isWithinRange = require('../is-within-range')
const { sampleReplies } = require('../sample-comment-html')

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

test('/lib/fetch-first-page-token.js', t => {
  t.test('- module exports a function', t => {
    const fetchReplies = require('../../lib/fetch-replies')
    t.equal(typeof fetchReplies, 'function', 'is of type function')
    t.end()
  })

  t.test('- fails if comment does not have a repliesToken', t => {
    const fetchReplies = require('../../lib/fetch-replies')
    fetchReplies('videoId', {stuff: 'here'})
      .fork(e => {
        t.ok(e, 'fails with an error')
        t.ok(/repliesToken/.test(e), 'error message is corrrect')
        t.end()
      }, t.fail)
  })

  t.test('- fetches replies for a comment', t => {
    const videoId = 'videoId'
    const repliesToken = 'repliesToken'

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

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchReplies = require('../../lib/fetch-replies')

    td.when(Youtube.commentReplies(videoId, repliesToken))
      .thenReturn(Task.of({
        content_html: sampleReplies(replies)
      }))

    fetchReplies(videoId, { repliesToken })
      .fork(t.fail, result => {
        t.equal(result.length, replies.length)
        result.forEach((r, i) => validateComment(t, r, replies[i]))
        td.reset()
        t.end()
      })
  })
})
