const { Observable } = require('rxjs')
const Task = require('data.task')
const Either = require('data.either')
const prop = require('propper')

const { regExec, strTrim } = require('./utils/string-utils')
const observableFromTask = require('./utils/observable-from-task')
const eitherToTask = require('./utils/either-to-task')
const fetchFirstPageToken = require('./fetch-first-page-token')
const { commentPage } = require('./youtube-api/youtube-api')

const getContentHtml = response =>
  Either.fromNullable(prop(response, 'content_html'))
    .leftMap(_ => 'API response does not contain a "content_html" field')

const extractNextPageToken = loadMoreWidgetHtml =>
  regExec(/data-uix-load-more-post-body\s*=\s*"page_token=([^"]+)"/i, loadMoreWidgetHtml)
    .map(([ _, t ]) => t)
    .map(strTrim)
    .map(t => decodeURIComponent(t))
    .fold(Task.rejected, Task.of)

const fetchCommentPage = (videoId, pageToken) =>
  commentPage(videoId, pageToken)
    .map(p =>
      getContentHtml(p)
        .map(contentHtml =>
          ({ contentHtml, loadMoreWidgetHtml: p.load_more_widget_html })))
    .chain(eitherToTask)

const observableCommentPage = (videoId, pageToken) =>
  observableFromTask(fetchCommentPage(videoId, pageToken))

const observableNextPageToken = loadMoreWidgetHtml =>
  observableFromTask(extractNextPageToken(loadMoreWidgetHtml))

const streamCommentPages = (videoId, pageToken) =>
  Observable.defer(() => observableCommentPage(videoId, pageToken))
    .flatMap(({contentHtml, loadMoreWidgetHtml}) =>
      Observable.concat(
        Observable.of(contentHtml),
        loadMoreWidgetHtml
          ? observableNextPageToken(loadMoreWidgetHtml)
              .flatMap(nextPageToken => streamCommentPages(videoId, nextPageToken))
          : Observable.empty()
      ))

const buildCommentPageStream = videoId =>
  observableFromTask(fetchFirstPageToken(videoId))
    .concatMap(pageToken => streamCommentPages(videoId, pageToken))

module.exports = buildCommentPageStream
