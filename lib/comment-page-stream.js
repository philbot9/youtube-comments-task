const Rx = require('rxjs')
const Task = require('data.task')
const Either = require('data.either')
const prop = require('propper')
const { cheerio, cheerioFind } = require('./utils/cheerio-utils')

const fetchFirstPageToken = require('./fetch-first-page-token')
const { commentPage } = require('./youtube-api/youtube-api')

const getContentHtml = response =>
  Either.fromNullable(prop(response, 'content_html'))
    .leftMap(_ => 'API response does not contain a "content_html" field')

const getLoadMoreWidgetHtml = response =>
  Either.fromNullable(prop(response, 'load_more_widget_html'))
    .leftMap(_ => 'API response does not contain a "load_more_widget_html" field')

const extractButtonElement = html =>
  cheerioFind(cheerio(html), 'button.comment-section-renderer-paginator')
    .leftMap(_ => 'Comment page HTML does not contain a "Load More" button')

const extractTokenAttribute = $btn =>
  Either.fromNullable($btn.attr('data-uix-load-more-post-body'))
    .leftMap(_ => 'The comment page "Load More" button does not have the token attribute')

const extractNextPageToken = p =>
  getLoadMoreWidgetHtml(p)
    .chain(extractButtonElement)
    .chain(extractTokenAttribute)
    .map(token => token.replace(/^page_token=/i, ''))
    .map(token => decodeURIComponent(token))
    .fold(e => Task.rejected(e),
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
