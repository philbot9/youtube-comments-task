const omit = require('lodash.omit')
const Either = require('data.either')
const { liftM2 } = require('control.monads')
const prop = require('propper')

const { regExec, strTrim } = require('./utils/string-utils')
const eitherToTask = require('./utils/either-to-task')
const { commentPage } = require('./youtube-api/youtube-api')

const getContentHtml = response =>
  Either.fromNullable(prop(response, 'content_html'))
    .leftMap(_ => 'API response does not contain a "content_html" field')

const extractNextPageToken = loadMoreWidgetHtml =>
  regExec(/data-uix-load-more-post-body\s*=\s*"page_token=([^"]+)"/i, loadMoreWidgetHtml)
    .map(([ _, t ]) => t)
    .map(strTrim)
    .map(t => decodeURIComponent(t))

const fetchCommentPage = (videoId, pageToken) =>
  commentPage(videoId, pageToken)
    .map(p => liftM2(
      (commentHtml, nextPageToken) => ({ commentHtml, nextPageToken }),
      getContentHtml(p),
      p.load_more_widget_html ? extractNextPageToken(p.load_more_widget_html) : Either.of(null)
    ))
    .chain(eitherToTask)
    .map(r => r.nextPageToken ? r : omit(r, 'nextPageToken'))

module.exports = fetchCommentPage
