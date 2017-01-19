const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')
const moment = require('moment')

const { sampleReplies } = require('../sample-comment-html')

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

describe('/lib/fetch-first-page-token.js', () => {
  afterEach(() => {
    td.reset()
  })

  it('- module exports a function', () => {
    const fetchReplies = require('../../lib/fetch-replies')
    expect(fetchReplies).to.be.a('function')
  })

  it('- fails if comment does not have a repliesToken', done => {
    const fetchReplies = require('../../lib/fetch-replies')
    fetchReplies('videoId', {stuff: 'here'})
      .fork(e => {
        expect(e).to.be.a('string')
        expect(e).to.match(/repliesToken/)
        done()
      }, res => {
        expect.fail(res)
        done('expected not to succeed')
      })
  })

  it('- fetches replies for a comment', done => {
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

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchReplies = require('../../lib/fetch-replies')

    td.when(Youtube.commentReplies(videoId, repliesToken))
      .thenReturn(Task.of({
        content_html: sampleReplies(replies)
      }))

    fetchReplies(videoId, { repliesToken })
      .fork(e => {
        expect.fail(e)
        done(e)
      }, result => {
        expect(result).to.be.an('array').of.length(2)
        result.forEach((r, i) => validateComment(r, replies[i]))
        done()
      })
  })
})
