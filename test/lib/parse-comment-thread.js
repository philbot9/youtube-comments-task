const { expect } = require('chai')
const cheerio = require('cheerio')
const moment = require('moment')

const parseCommentThread = require('../../lib/parse-comment-thread')

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

const validateComment = (comment, exp) => {
  expect(comment).to.have.property('id', exp.id)
  expect(comment).to.have.property('author', exp.author)
  expect(comment).to.have.property('authorLink', exp.authorLink)
  expect(comment).to.have.property('authorThumb', exp.authorThumb)
  expect(comment).to.have.property('text', exp.text)
  expect(comment).to.have.property('likes', exp.likes)
  expect(comment).to.have.property('time', exp.time)
  expect(comment).to.have.property('timestamp').that.is.a('number').closeTo(exp.timestamp, (60 * 1000))
}

describe('/lib/parse-comment-thread.js', () => {
  it('exports a function', () => {
    expect(parseCommentThread).to.be.a('function')
  })

  it('parses a comment thread without replies', (done) => {
    const exp = {
      id: COMMENT_ID,
      author: COMMENT_AUTHOR,
      authorLink: COMMENT_AUTHOR_LINK,
      authorThumb: COMMENT_AUTHOR_THUMB,
      text: COMMENT_TEXT,
      likes: COMMENT_LIKES,
      time: '3 months ago',
      timestamp: parseInt(moment().subtract(3, 'months').format('x'), 10),
      hasReplies: false
    }

    const html = sampleComment(exp)
    parseCommentThread(cheerio(html))
      .fold(e => {
        expect.fail(e)
        done(e)
      }, result => {
        validateComment(result, exp)
        expect(result).to.have.property('hasReplies', false)
        done()
      })
  })

  it('parses comment with replies (non-collapsed)', (done) => {
    const comment = {
      id: 'commentid',
      author: 'comment_author',
      authorLink: 'comment_author_link',
      authorThumb: 'comment_author_thumb',
      text: 'comment_text',
      likes: 3,
      time: '1 week ago',
      timestamp: parseInt(moment().subtract(1, 'week').format('x'), 10),
      hasReplies: true,
      numReplies: 2
    }

    const replies = [
      {
        id: 'commentid.reply1id',
        author: 'reply1_author',
        authorLink: 'reply1_author_link',
        authorThumb: 'reply1_author_thumb',
        text: 'reply1_text',
        likes: 10,
        time: '10 hours ago',
        timestamp: parseInt(moment().subtract(10, 'hours').format('x'), 10)
      },
      {
        id: 'commentid.reply2id',
        author: 'reply2_author',
        authorLink: 'reply2_author_link',
        authorThumb: 'reply2_author_thumb',
        text: 'reply2_text',
        likes: 0,
        time: '2 minutes ago',
        timestamp: parseInt(moment().subtract(2, 'minutes').format('x'), 10)
      }
    ]

    const html = sampleComment(comment, replies)

    parseCommentThread(cheerio(html))
      .fold(e => {
        expect.fail(e)
      }, result => {
        validateComment(result, comment)
        expect(result).to.have.property('hasReplies', true)
        expect(result).to.have.property('numReplies', 2)
        expect(result).to.have.property('replies').which.is.a('array').of.length(2)
        result.replies.forEach((r, i) => validateComment(r, replies[i]))
        done()
      })
  })

  it('parses comment replies information (collapsed comments)', (done) => {
    const comment = {
      id: 'commentid',
      author: 'comment_author',
      authorLink: 'comment_author_link',
      authorThumb: 'comment_author_thumb',
      text: 'comment_text',
      likes: 3,
      time: '1 week ago',
      timestamp: parseInt(moment().subtract(1, 'week').format('x'), 10),
      hasReplies: true,
      repliesToken: REPLIES_TOKEN
    }

    const replies = [
      {
        id: 'commentid.reply1id',
        author: 'reply1_author',
        authorLink: 'reply1_author_link',
        authorThumb: 'reply1_author_thumb',
        text: 'reply1_text',
        likes: 10,
        time: '10 hours ago',
        timestamp: parseInt(moment().subtract(10, 'hours').format('x'), 10)
      },
      {
        id: 'commentid.reply2id',
        author: 'reply2_author',
        authorLink: 'reply2_author_link',
        authorThumb: 'reply2_author_thumb',
        text: 'reply2_text',
        likes: 0,
        time: '2 minutes ago',
        timestamp: parseInt(moment().subtract(2, 'minutes').format('x'), 10)
      },
      {
        id: 'commentid.reply3id',
        author: 'reply3_author',
        authorLink: 'reply3_author_link',
        authorThumb: 'reply3_author_thumb',
        text: 'reply3_text',
        likes: 0,
        time: '1 minute ago',
        timestamp: parseInt(moment().subtract(1, 'minute').format('x'), 10)
      }
    ]

    const html = sampleComment(comment, replies)

    parseCommentThread(cheerio(html))
      .fold(e => {
        expect.fail(e)
        done(e)
      }, result => {
        validateComment(result, comment)
        expect(result).to.have.property('hasReplies', true)
        expect(result).to.not.have.property('replies')
        done()
      })
  })
})
