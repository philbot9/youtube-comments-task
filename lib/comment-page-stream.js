const Rx = require('rxjs')
const Task = require('data.task')
const Either = require('data.either')
const prop = require('propper')

const { regExec, strTrim } = require('./utils/string-utils')
const fetchFirstPageToken = require('./fetch-first-page-token')
const { commentPage } = require('./youtube-api/youtube-api')

const getContentHtml = response =>
  Either.fromNullable(prop(response, 'content_html'))
    .leftMap(_ => 'API response does not contain a "content_html" field')

const getLoadMoreWidgetHtml = response =>
  Either.fromNullable(prop(response, 'load_more_widget_html'))
    .leftMap(_ => 'API response does not contain a "load_more_widget_html" field')

const extractNextPageToken = p =>
  getLoadMoreWidgetHtml(p)
    .chain(html =>
        regExec(/data-uix-load-more-post-body\s*=\s*"page_token=([^"]+)"/i, html))
    .map(([ _, t ]) => t)
    .map(strTrim)
    .map(t => decodeURIComponent(t))
    .fold(e => Task.rejected(_ => 'Load More Widget does not contain next page token'),
          t => Task.of(t))

const observerEmitPage = observer => page =>
  getContentHtml(page)
    .map(html => observer.next(html))
    .fold(e => Task.rejected(e),
          _ => Task.of(page))

const buildCommentPageStream = videoId =>
  Rx.Observable.create(observer => {
    const emitPage = observerEmitPage(observer)

    const fetchAllPages = pageToken =>
      commentPage(videoId, pageToken)
        .chain(emitPage)
        .chain(p =>
          p.load_more_widget_html
            ? extractNextPageToken(p).chain(fetchAllPages)
            : Task.of(`${videoId} - complete`))

    fetchFirstPageToken(videoId)
      .chain(fetchAllPages)
      .fork(e => observer.error(e), _ => observer.complete())
  })

module.exports = buildCommentPageStream
