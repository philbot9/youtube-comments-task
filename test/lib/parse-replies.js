const { expect } = require('chai')
const cheerio = require('cheerio')
const moment = require('moment')

const parseReplies = require('../../lib/parse-replies')

const { sampleComment } = require('../sample-comment-html')

const validateComment = (comment, exp) => {
  expect(comment).to.be.ok

  expect(comment).to.have.property('id', exp.id)
  expect(comment).to.have.property('author', exp.author)
  expect(comment).to.have.property('authorLink', exp.authorLink)
  expect(comment).to.have.property('authorThumb', exp.authorThumb)
  expect(comment).to.have.property('text', exp.text)
  expect(comment).to.have.property('likes', exp.likes)
  expect(comment).to.have.property('time', exp.time)
  expect(comment).to.have.property('timestamp').that.is.a('number').closeTo(exp.timestamp, (60*1000))
}

describe('/lib/parse-replies.js', () => {
  it('- parses replies', done => {
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

    const html = sampleComment({}, replies)
    const $replies = cheerio(html).find('.comment-replies-renderer')

    parseReplies($replies)
      .fold(e => {
        expect.fail(e)
        done(e)
      }, result => {
        expect(replies).to.be.a('array').of.length(2)
        result.forEach((r, i) => validateComment(r, replies[i]))
        done()
      })
  })
})
