const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')

const contentHtml = n => `<div>comment_page_${n}</div>`
const loadMoreWidgetHtml = t => `
  <div>
    <button attr1=15 data-uix-load-more-post-body="page_token=${encodeURIComponent(t)}" attr3="bla">Show more</button>
  </div>`

describe('/lib/fetch-comments.js', () => {
  afterEach(() => {
    td.reset()
  })

  it('exports a function', () => {
    const fetchCommentPage = require('../../lib/fetch-comment-page')
    expect(fetchCommentPage).to.be.a('function')
  })

  it('fetches a single comment page HTML', done => {
    const videoId = 'videoId'
    const pageToken = 'token1'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchCommentPage = require('../../lib/fetch-comment-page')
    const html = contentHtml(1)

    td.when(Youtube.commentPage(videoId, pageToken))
      .thenReturn(Task.of({
        content_html: html
      }))

    fetchCommentPage(videoId, pageToken)
      .fork(e => done(`Got an error: ${e}`),
            p => {
              expect(p).to.have.property('commentHtml').equal(html)
              expect(p).not.to.have.property('nextPageToken')
              done()
            })
  })

  it('includes the next page token in the result', done => {
    const videoId = 'videoId'
    const pageToken = 'token1'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchCommentPage = require('../../lib/fetch-comment-page')
    const commentHtml = contentHtml(1)
    const nextPageToken = 'EhYSC3B2QXNxUGJ6OVJvwAEAyAEA4AEBGAYyWwpGQ2cwUWhaSEkwdURZMFFJZ0FDZ0JFaFFJQmhEUTZOQzdsOWpSQWhpNDE4Ym9nTV9SQWhnQ0lBNG9oSl92ZzVUTTJkVzRBUSIPIgtwdkFzcVBiejlSbzABKA4%3D'
    const loadMoreHtml = loadMoreWidgetHtml(nextPageToken)

    td.when(Youtube.commentPage(videoId, pageToken))
      .thenReturn(Task.of({
        content_html: commentHtml,
        load_more_widget_html: loadMoreHtml
      }))

    fetchCommentPage(videoId, pageToken)
      .fork(e => done(`Got an error: ${e}`),
            p => {
              expect(p).to.have.property('commentHtml').equal(commentHtml)
              expect(p).to.have.property('nextPageToken').equal(nextPageToken)
              done()
            })
  })

  it('task fails with an error if fetch fails', done => {
    const videoId = 'videoId'
    const pageToken = 'token1'
    const errMsg = 'fetch failed error msg'
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchCommentPage = require('../../lib/fetch-comment-page')

    td.when(Youtube.commentPage(videoId, pageToken))
      .thenReturn(Task.rejected(errMsg))

    fetchCommentPage(videoId, pageToken)
      .fork(e => {
        expect(e).to.equal(errMsg)
        done()
      }, _ => done('task should not succeed'))
  })

  it('fails with an error if response is invalid', done => {
    const videoId = 'videoId'
    const pageToken = 'token1'
    const errMsg = 'fetch failed error msg'
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchCommentPage = require('../../lib/fetch-comment-page')

    td.when(Youtube.commentPage(videoId, pageToken))
      .thenReturn(Task.of({nonsense: 'yep'}))

    fetchCommentPage(videoId, pageToken)
      .fork(e => {
        expect(e).to.match(/content_html/i)
        done()
      }, _ => done('task should not succeed'))
  })

  it('fails with an error if response is invalid', done => {
    const videoId = 'videoId'
    const pageToken = 'token1'
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchCommentPage = require('../../lib/fetch-comment-page')

    td.when(Youtube.commentPage(videoId, pageToken))
      .thenReturn(Task.of({nonsense: 'yep'}))

    fetchCommentPage(videoId, pageToken)
      .fork(e => {
        expect(e).to.match(/content_html/i)
        done()
      }, _ => done('task should not succeed'))
  })

  it('fails with an error if the load_more_widget_html does not contain a next page token', done => {
    const videoId = 'videoId'
    const pageToken = 'token1'
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchCommentPage = require('../../lib/fetch-comment-page')

    td.when(Youtube.commentPage(videoId, pageToken))
      .thenReturn(Task.of({
        content_html: contentHtml(1),
        load_more_widget_html: '<div>bla</div>'
      }))

    fetchCommentPage(videoId, pageToken)
      .fork(e => {
        expect(e).to.match(/load_more_widget_html/i)
        done()
      }, _ => done('task should not succeed'))
  })

})
