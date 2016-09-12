import Rx from 'rxjs'
import cheerio from 'cheerio'
import fetchFirstPageTokenImport from './fetch-first-page-token'
import fetchCommentPageImport from './fetch-comment-page'

export default function (videoId, getSession, deps = {}) {
  if (!videoId) {
    throw new Error('Missing first parameter: videoId')
  }
  if (!getSession) {
    throw new Error('Missing second parameter: getSession')
  }

  const {
    fetchFirstPageToken = fetchFirstPageTokenImport,
    fetchCommentPage = fetchCommentPageImport
  } = deps

  return Rx.Observable.create(observer => {
    const fetchAndEmitAllPages = buildFetchAndEmitAllPages({
      videoId,
      observer,
      fetchCommentPage,
      getSession,
      extractNextPageToken
    })

    fetchFirstPageToken(videoId, getSession)
      .then(fetchAndEmitAllPages)
  })
}

export function buildFetchAndEmitAllPages ({
  videoId,
  observer,
  fetchCommentPage,
  getSession,
  extractNextPageToken
}) {
  if (!videoId) {
    throw new Error('Missing parameter: videoId')
  }
  if (!observer) {
    throw new Error('Missing parameter: observer')
  }
  if (!fetchCommentPage) {
    throw new Error('Missing parameter: fetchCommentPage')
  }
  if (!getSession) {
    throw new Error('Missing parameter: getSession')
  }
  if (!extractNextPageToken) {
    throw new Error('Missing parameter: extractNextPageToken')
  }

  return function fetchAndEmitAllPages (pageToken) {
    if (!pageToken) {
      return Promise.reject('Missing parameter: pageToken')
    }

    return fetchCommentPage(videoId, pageToken, getSession)
      .then(response => {
        // emit the comment page html
        observer.next(response.content_html)
        return response
      })
      .then((response) => extractNextPageToken(response))
      .then(nextPageToken => {
        console.log('nextpagetoken', nextPageToken)
        if (nextPageToken) {
          fetchAndEmitAllPages(nextPageToken)
        } else {
          observer.complete()
        }
      })
  }
}

export function extractNextPageToken (response) {
  console.log('extracting', Object.keys(response))
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
