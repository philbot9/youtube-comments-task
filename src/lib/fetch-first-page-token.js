import cheerio from 'cheerio'
import { buildWatchFragmentsUrl } from './url-builder'

export default function (videoId, dependencies) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }
  if (!dependencies) {
    return Promise.reject('Missing second parameter: dependencies')
  }

  const { getSession, request } = dependencies

  if (!getSession) {
    return Promise.reject('Missing dependency parameter: getSession')
  }
  if (!request) {
    return Promise.reject('Missing dependency parameter: request')
  }

  return fetchCommentsFragment(videoId, getSession, request)
    .then(extractPageToken)
}

export function fetchCommentsFragment (videoId, getSession, request) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }
  if (!getSession) {
    return Promise.reject('Missing second parameter: getSession')
  }
  if (!request) {
    return Promise.reject('Missing third parameter: request')
  }

  return getSession(videoId)
    .then(({ sessionToken, commentsToken }) => {
      const url = buildWatchFragmentsUrl(videoId, commentsToken)
      const form = { session_token: sessionToken }

      return request({
        method: 'POST',
        json: true,
        url,
        form
      })
    })
}

export function extractPageToken (response) {
  if (!response) {
    throw new Error('Missing parameter: response')
  }

  const html = response.body && response.body['watch-discussion']
    ? response.body['watch-discussion']
    : null
  if (!html) {
    throw new Error('Missing field in response: watch-discussion')
  }

  const $ = cheerio.load(html)
  const $btn = $('button[data-menu_name="newest-first"]')
  if (!$btn.length) {
    throw new Error('Cannot find page token button element.')
  }

  const pageToken = $btn.attr('data-token')
  if (!pageToken) {
    throw new Error('Button element is missing the data-token attribute.')
  }
  return pageToken
}
