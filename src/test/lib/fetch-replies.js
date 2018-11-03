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
  expect(comment).to.have
    .property('timestamp')
    .that.is.a('number')
    .closeTo(exp.timestamp, 60 * 1000)
}

describe('/lib/fetch-first-page-token.js', () => {
  afterEach(() => {
    td.reset()
  })

  it('module exports a function', () => {
    const fetchReplies = require('../../lib/fetch-replies')
    expect(fetchReplies).to.be.a('function')
  })

  it('fails if comment does not have a repliesToken', done => {
    const videoId = 'videoId'
    const expectedError = { error: 'here' }
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchReplies = require('../../lib/fetch-replies')

    td
      .when(
        errorHandler.scraperError({
          videoId,
          message: 'Comment parameter object does not have a repliesToken field',
          component: 'fetch-replies',
          operation: 'fetch-replies'
        })
      )
      .thenReturn(expectedError)

    fetchReplies('videoId', { stuff: 'here' }).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => {
        expect.fail(res)
        done('expected not to succeed')
      }
    )
  })

  it('fails if API response is invalid', done => {
    const videoId = 'videoId'
    const repliesToken = 'repliesToken'
    const expectedError = { error: 'here' }

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchReplies = require('../../lib/fetch-replies')

    td
      .when(Youtube.commentReplies(videoId, repliesToken))
      .thenReturn(Task.of({ nonsense: 'yep' }))

    td
      .when(
        errorHandler.scraperError({
          videoId,
          message: 'Invalid Replies-API response, does not contain content_html field',
          component: 'fetch-replies',
          operation: 'fetch-replies'
        })
      )
      .thenReturn(expectedError)

    fetchReplies('videoId', { repliesToken }).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => {
        expect.fail(res)
        done('expected not to succeed')
      }
    )
  })

  it('fetches replies for a comment', done => {
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

    td.when(Youtube.commentReplies(videoId, repliesToken)).thenReturn(
      Task.of({
        content_html: sampleReplies(replies)
      })
    )

    fetchReplies(videoId, { repliesToken }).fork(
      e => {
        expect.fail(e)
        done(e)
      },
      result => {
        expect(result).to.be.an('array').of.length(2)
        result.forEach((r, i) => validateComment(r, replies[i]))
        done()
      }
    )
  })

  it('Returns an empty array if replies cannot be parsed', done => {
    const videoId = 'videoId'
    const repliesToken = 'replies_token'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchReplies = require('../../lib/fetch-replies')

    td.when(Youtube.commentReplies(videoId, repliesToken)).thenReturn(
      Task.of({
        content_html: ''
      })
    )

    fetchReplies(videoId, { repliesToken }).fork(
      e => {
        done('not expected to fail ' + e)
      },
      res => {
        expect(res).to.be.a('array').of.length(0)
        done()
      }
    )
  })

  it('Fetches multiple pages of replies', done => {
    const videoId = 'videoId'
    const repliesToken = 'repliesToken'
    const nextRepliesToken = 'nextRepliesToken%3asd'

    const repliesPage1 = [
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

    const repliesPage2 = [
      {
        id: 'commentid.reply3id',
        author: 'reply3_author',
        authorLink: 'reply3_author_link',
        authorThumb: 'reply3_author_thumb',
        text: 'reply3_text',
        likes: 10,
        time: '10 hours ago',
        timestamp: parseInt(moment().subtract(10, 'hours').format('x'), 10)
      },
      {
        id: 'commentid.reply4id',
        author: 'reply4_author',
        authorLink: 'reply4_author_link',
        authorThumb: 'reply4_author_thumb',
        text: 'reply4_text',
        likes: 0,
        time: '2 minutes ago',
        timestamp: parseInt(moment().subtract(2, 'minutes').format('x'), 10)
      }
    ]

    const page1Html =
      sampleReplies(repliesPage1) +
      `<button 
        class="load-more-button" 
        data-uix-load-more-post-body="page_token=${encodeURIComponent(nextRepliesToken)}">
        Load more
      </button>`

    const page2Html = sampleReplies(repliesPage2)

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchReplies = require('../../lib/fetch-replies')

    td.when(Youtube.commentReplies(videoId, repliesToken)).thenReturn(
      Task.of({
        content_html: page1Html
      })
    )

    td.when(Youtube.commentReplies(videoId, nextRepliesToken)).thenReturn(
      Task.of({
        content_html: page2Html
      })
    )

    fetchReplies(videoId, { repliesToken }).fork(
      e => {
        expect.fail(e)
        done(e)
      },
      result => {
        const allReplies = repliesPage1.concat(repliesPage2)

        expect(result).to.be.an('array').of.length(4)
        result.forEach((r, i) => validateComment(r, allReplies[i]))
        done()
      }
    )
  })
})
