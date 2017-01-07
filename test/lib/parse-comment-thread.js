const test = require('blue-tape')
const cheerio = require('cheerio')
const moment = require('moment')

const parseCommentThread = require('../../lib/parse-comment-thread')

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

const validateComment = (t, comment, exp) => {
  t.equal(comment.id, exp.id, 'id is correct')
  t.equal(comment.author, exp.author, 'author is correct')
  t.equal(comment.authorLink, exp.authorLink, 'author link is correct')
  t.equal(comment.authorThumb, exp.authorThumb, 'author thumb is correct')
  t.equal(comment.text, exp.text, 'text is correct')
  t.equal(comment.likes, exp.likes, 'comment likes is correct')
  t.equal(comment.time, exp.time, 'time is correct is correct')
  t.ok(isWithinRange(comment.timestamp, exp.timestamp, (60 * 1000)), 'timestamp is correct')

  t.equal(comment.hasReplies, exp.hasReplies, 'hasReplies is correct')
  t.equal(comment.numReplies, exp.numReplies, 'numReplies is correct')
  t.equal(comment.repliesToken, exp.repliesToken, 'repliesToken is correct')
}

test('/lib/parse-comment-thread.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof parseCommentThread, 'function', 'is of type function')
    t.end()
  })

  t.test('- parses a comment thread without replies', t => {
    const exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: moment().subtract(3, 'months').format('x'),
      hasReplies: false
    }

    const html = sampleComment(exp)
    parseCommentThread(cheerio(html))
      .fold(t.fail, result => {
        validateComment(t, result, exp)
        t.end()
      })
  })
})

// t.test('- parses comment with replies (non-collapsed)', t => {
//   const comment = {
//     id: 'commentid',
//     author: 'comment_author',
//     authorLink: 'comment_author_link',
//     authorThumb: 'comment_author_thumb',
//     text: 'comment_text',
//     likes: 3,
//     time: '1 week ago',
//     timestamp: moment().subtract(1, 'week').format('x'),
//     hasReplies: true,
//     numReplies: 2
//   }
//
//   const replies = [
//     {
//       id: 'commentid.reply1id',
//       author: 'reply1_author',
//       authorLink: 'reply1_author_link',
//       authorThumb: 'reply1_author_thumb',
//       text: 'reply1_text',
//       likes: 10,
//       time: '10 hours ago',
//       timestamp: moment().subtract(10, 'hours').format('x')
//     },
//     {
//       id: 'commentid.reply2id',
//       author: 'reply2_author',
//       authorLink: 'reply2_author_link',
//       authorThumb: 'reply2_author_thumb',
//       text: 'reply2_text',
//       likes: 0,
//       time: '2 minutes ago',
//       timestamp: moment().subtract(2, 'minutes').format('x')
//     }
//   ]
//
//   const html = sampleComment(comment, replies)
//
//   parseComment(cheerio(html))
//     .fold(t.fail, result => {
//       validateComment(t, result, comment)
//
//       t.ok(typeof result.replies, 'object', 'result contains replies array')
//       t.equal(result.replies.length, 2, 'array contains correct number of replies')
//       result.replies.forEach((r, i) => validateComment(t, r, replies[i]))
//     })
// })
