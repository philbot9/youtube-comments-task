import Rx from 'rxjs'
import cheerio from 'cheerio'
import until from 'promised-until'

const fetchFirstPageToken = require('./fetch-first-page-token')
const buildRequestFormData = require('./build-request-form-data')
const { buildCommentServiceUrl } = require('./url-builder')
const { fetchCommentPage } = require('./youtube-api')

export default function (videoId, dependencies) {
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
          .then(session => fetchCommentPage(pageToken, session, request)
          .then(response => {
            observer.next(response.content_html)
            return extractNextPageToken(response)
          })
      }
    )(fetchFirstPageToken(videoId, {getSession, request}))
      .then(() => observer.complete())
  })
}

export function extractNextPageToken (response) {
  if (!response) {
    throw new Error('Missing parameter: response')
  }

  const html = response.load_more_widget_html
  if (!html) {
    return null
  }

  const $ = cheerio.load(html)
  const $btn = $('button.comment-section-renderer-paginator')
  if (!$btn.length) {
    throw new Error('Cannot find button element')
  }

  const attrValue = $btn.attr('data-uix-load-more-post-body')
  if (!attrValue) {
    throw new Error('Button element doesn\'t have a page token attribute')
  }

  return decodeURIComponent(attrValue.replace(/^page_token=/i, ''))
}
