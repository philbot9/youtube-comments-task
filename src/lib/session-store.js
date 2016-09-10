import mem from 'mem'
import requestImport from './request'

export const URL_TEMPLATE = 'https://www.youtube.com/watch?v={{videoId}}'
export const SESSION_TOKEN_REGEX = /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/i
export const COMMENTS_TOKEN_REGEX = /\'COMMENTS_TOKEN\'\s*\n*:\s*\n*"(.*)"/i

export default function (config = {}, deps = {}) {
  const { cacheDuration = (1000 * 60 * 30) } = config
  const { request = requestImport } = deps

  // return a memoized function
  return mem(initialiseSession, {maxAge: cacheDuration})

  function initialiseSession (videoId) {
    return fetchVideoPage(videoId, request)
      .then(html => {
        return {
          sessionToken: extractToken(SESSION_TOKEN_REGEX, html),
          commentsToken: extractToken(COMMENTS_TOKEN_REGEX, html)
        }
      })
  }
}

export function fetchVideoPage(videoId, request) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }

  if (!request) {
    return Promise.reject('Missing second parameter: request')
  }

  return request(URL_TEMPLATE.replace('{{videoId}}', videoId))
}

export function extractToken (regex, html) {
  if (!regex) {
    throw new Error('missing first parameter: regex')
  }
  if (!html) {
    throw new Error('missing second parameter: html')
  }

  const m = regex.exec(html)
  if (!m || m.length < 2) {
    throw new Error('Cannot extract token using', regex.toString())
  }
  return m[1]
}
