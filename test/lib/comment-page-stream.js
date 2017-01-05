const test = require('blue-tape')
const td = require('testdouble')
const Rx = require('rxjs')
const Task = require('data.task')

const contentHtml = n => `<html>comment_page_${n}</html>`

const loadMoreWidgetHtml = pageToken =>
  `<html>
    <button
      class="comment-section-renderer-paginator"
      data-uix-load-more-post-body="${pageToken}">
        btn
    </button>
  </html>`

test('/lib/comment-page-stream.js', t => {
  t.test('- exports a function', t => {
    const buildCommentPageStream = require('../../lib/comment-page-stream')
    t.equal(typeof buildCommentPageStream, 'function', 'is of type function')
    t.end()
  })

  t.test('- builds a comment page stream', t => {
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

    t.ok(stream instanceof Rx.Observable, 'is an observable')
    stream.subscribe({
      next: v => results.push(v),
      error: e => t.fail(`stream error ${e}`),
      complete: () => {
        t.deepEqual(results, [contentHtml(1)])
        td.reset()
        t.end()
      }
    })
  })

  t.test('- comment page stream emits multiple pages', t => {
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
        error: e => t.fail(`stream error ${e}`),
        complete: () => {
          t.deepEqual(results, expected)
          td.reset()
          t.end()
        }
      })
  })

  t.test('- stream emits error if fetchFirstPageToken fails', t => {
    const videoId = 'videoId'
    const errorMessage = 'errrrrr'

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const buildCommentPageStream = require('../../lib/comment-page-stream')

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.rejected(errorMessage))

    buildCommentPageStream(videoId)
      .subscribe({
        next: _ => t.fail('stream should not emit anything'),
        error: e => {
          t.equal(e, errorMessage, 'stream emits correct error')
          td.reset()
          t.end()
        },
        complete: _ => t.fail('stream should not complete')
      })
  })

  t.test('- stream emits error if fetching commentPage fails', t => {
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
        next: _ => t.fail('stream should not emit anything'),
        error: e => {
          t.equal(e, errMsg, 'stream emits correct error')
          td.reset()
          t.end()
        },
        complete: _ => t.fail('stream should not complete')
      })
  })

  t.test('- stream emits error if fetch commentPage returns invalid response', t => {
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
        next: _ => t.fail('stream should not emit anything'),
        error: e => {
          t.ok(/API response/i.test(e), 'stream emits correct error')
          td.reset()
          t.end()
        },
        complete: _ => t.fail('stream should not complete')
      })
  })
})
