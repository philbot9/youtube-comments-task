import Rx from 'rxjs'
import cheerio from 'cheerio'
import fetchFirstPageTokenImport from './fetch-first-page-token'
import fetchCommentPageImport from './fetch-comment-page'
import until from 'promised-until'

export default function (videoId, getSession, deps = {}) {
  if (!videoId) {
    throw new Error('Missing first parameter: videoId')
  }
  if (!getSession) {
    throw new Error('Missing second parameter: getSession')
  }

  const {
    fetchFirstPageToken = fetchFirstPageTokenImport,
    fetchCommentPage = fetchCommentPageImport,
    extractNextPageToken = extractNextPageToken
  } = deps

  return Rx.Observable.create(observer => {
    until(
      pageToken => !pageToken,
      pageToken => {
        return fetchCommentPage(videoId, pageToken, getSession)
          .then(response => {
            observer.next(response.content_html)
            return extractNextPageToken(response)
          })
      }
    )(fetchFirstPageToken(videoId, getSession))
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
