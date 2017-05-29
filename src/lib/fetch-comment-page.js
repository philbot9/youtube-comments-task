const { omit } = require('ramda')
const Either = require('data.either')
const { liftM2 } = require('control.monads')
const prop = require('propper')

const { regExec, strTrim } = require('./utils/string-utils')
const eitherToTask = require('./utils/either-to-task')
const { commentPage } = require('./youtube-api/youtube-api')
const { scraperError } = require('./error-handler')

const getContentHtml = response =>
  Either.fromNullable(prop(response, 'content_html')).leftMap(
    _ => 'API response does not contain a "content_html" field'
  )

const extractNextPageToken = loadMoreWidgetHtml =>
  regExec(
    /data-uix-load-more-post-body\s*=\s*"page_token=([^"]+)"/i,
    loadMoreWidgetHtml
  )
    .map(([_, t]) => t)
    .map(strTrim)
    .map(decodeURIComponent)
    .leftMap(
      _ =>
        'API resonse load_more_widget_html does not contain a next page token'
    )

const fetchCommentPage = (videoId, pageToken) =>
  commentPage(videoId, pageToken)
    .map(p =>
      liftM2(
        (commentHtml, nextPageToken) => ({ commentHtml, nextPageToken }),
        getContentHtml(p),
        p.load_more_widget_html
          ? extractNextPageToken(p.load_more_widget_html)
          : Either.of(null)
      )
    )
    .chain(eitherToTask)
    .map(r => (r.nextPageToken ? r : omit('nextPageToken', r)))
    .rejectedMap(
      e =>
        e.type
          ? e
          : scraperError({
              videoId,
              message: e,
              component: 'fetch-comment-page',
              operation: 'fetch-comment-page'
            })
    )

module.exports = fetchCommentPage
