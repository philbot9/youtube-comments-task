const Rx = require('rxjs')
const until = require('promised-until')

const fetchFirstPageToken = require('./fetch-first-page-token')
const extractNextPageToken = require('./extract-next-page-token')
const buildRequestFormData = require('./build-request-form-data')
const { buildCommentServiceUrl } = require('./url-builder')
const { fetchCommentPage } = require('./youtube-api')

module.exports = (videoId, dependencies) => {
  if (!videoId) {
    throw new Error('Missing first parameter: videoId')
  }

  if (!dependencies) {
    throw new Error('Missing second parameter: dependencies')
  }

  const { getSession, request } = dependencies

  if (!getSession) {
    throw new Error('Missing dependency parameter: getSession')
  }

  if (!request) {
    throw new Error('Missing dependency parameter: request')
  }

  return Rx.Observable.create(observer => {
    until(
      (pageToken) => !pageToken,
      (pageToken) => {
        return getSession()
          .then(session => fetchCommentPage(pageToken, session, request))
          .then(response => {
            observer.next(response.content_html)
            return extractNextPageToken(response.load_more_widget_html)
          })
      }
    )(fetchFirstPageToken(videoId, {getSession, request}))
      .then(() => observer.complete())
  })
}
