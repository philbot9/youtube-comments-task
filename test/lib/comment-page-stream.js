const { expect } = require('chai')
const td = require('testdouble')
const Rx = require('rxjs')
const Task = require('data.task')

const contentHtml = n => `<html>comment_page_${n}</html>`

const loadMoreWidgetHtml = pageToken =>
  `<button
    class="comment-section-renderer-paginator"
    data-uix-load-more-post-body="page_token=${pageToken}">
      btn
  </button>`

describe('/lib/comment-page-stream.js', () => {
  afterEach(() => {
    td.reset()
  })

  it('exports a function', () => {
    const buildCommentPageStream = require('../../lib/comment-page-stream')
    expect(buildCommentPageStream).to.be.a('function')
  })

  it('builds a comment page stream', done => {
    const videoId = 'videoId'
    const pageTokens = ['token1']

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.of(pageTokens[0]))

    td.when(Youtube.commentPage(videoId, pageTokens[0]))
      .thenReturn(Task.of({
        content_html: contentHtml(1)
      }))

    const results = []
    const stream = buildCommentPageStream(videoId)

    expect(stream).to.be.instanceof(Rx.Observable)
    stream.subscribe({
      next: v => results.push(v),
      error: e => done(`stream error ${e}`),
      complete: () => {
        expect(results).to.deep.equal([contentHtml(1)])
        done()
      }
    })
  })

  it('comment page stream emits multiple pages', done => {
    const videoId = 'videoId'
    const pageTokens = ['token1', 'token2', 'token3']

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    const pageFetches = [1, 2, 3].map(n => {
      return {
        req: pageTokens[n - 1],
        res: {
          content_html: contentHtml(n),
          load_more_widget_html: (n < pageTokens.length)
            ? loadMoreWidgetHtml(pageTokens[n])
            : undefined
        }
      }
    })

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.of(pageTokens[0]))

    pageFetches.forEach(({ req, res }) =>
      td.when(Youtube.commentPage(videoId, req)).thenReturn(Task.of(res)))

    const results = []
    const expected = [1, 2, 3].map(contentHtml)

    buildCommentPageStream(videoId)
      .subscribe({
        next: v => results.push(v),
        error: e => done(`stream error ${e}`),
        complete: () => {
          expect(results).to.deep.equal(expected)
          done()
        }
      })
  })

  it('stream emits error if fetchFirstPageToken fails', done => {
    const videoId = 'videoId'
    const errorMessage = 'errrrrr'

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.rejected(errorMessage))

    buildCommentPageStream(videoId)
      .subscribe({
        next: _ => done('stream should not emit anything'),
        error: e => {
          expect(e).to.equal(errorMessage)
          done()
        },
        complete: _ => done('stream should not complete')
      })
  })

  it('stream emits error if fetching commentPage fails', done => {
    const videoId = 'videoId'
    const pageTokens = ['token1']
    const errMsg = 'errrr'

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.of(pageTokens[0]))

    td.when(Youtube.commentPage(videoId, pageTokens[0]))
      .thenReturn(Task.rejected(errMsg))

    buildCommentPageStream(videoId)
      .subscribe({
        next: _ => done('stream should not emit anything'),
        error: e => {
          expect(e).to.equal(errMsg)
          done()
        },
        complete: _ => done('stream should not complete')
      })
  })

  it('stream emits error if fetch commentPage returns invalid response', done => {
    const videoId = 'videoId'
    const pageTokens = ['token1']

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.of(pageTokens[0]))

    td.when(Youtube.commentPage(videoId, pageTokens[0]))
      .thenReturn(Task.of({some: 'crap'}))

    buildCommentPageStream(videoId)
      .subscribe({
        next: _ => done('stream should not emit anything'),
        error: e => {
          expect(e).to.match(/API response/i)
          done()
        },
        complete: _ => done('stream should not complete')
      })
  })

  it('stream emits error if load_more_widget_html does not contain a load more button', done => {
    const videoId = 'videoId'
    const pageTokens = ['token1']

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    const invalidLoadMoreWidget = '<p>whatever</p>'

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.of(pageTokens[0]))

    td.when(Youtube.commentPage(videoId, pageTokens[0]))
      .thenReturn(Task.of({
        content_html: contentHtml(0),
        load_more_widget_html: invalidLoadMoreWidget
      }))

    buildCommentPageStream(videoId)
      .subscribe({
        next: p => expect(p).to.equal(contentHtml(0)),
        error: e => {
          expect(e).to.match(/does not contain a match/i)
          done()
        },
        complete: _ => done('stream should not complete')
      })
  })
})
