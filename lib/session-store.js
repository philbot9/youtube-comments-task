const mem = require('mem')
const { buildVideoPageUrl } = require('./url-builder')

const SESSION_TOKEN_REGEX = /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/i
const COMMENTS_TOKEN_REGEX = /\'COMMENTS_TOKEN\'\s*\n*:\s*\n*"(.*)"/i

module.exports = (config, dependencies) => {
  if (!dependencies) {
    throw new Error('Missing second parameter: dependencies')
  }

  const { cacheDuration = (1000 * 60 * 5) } = config || {}

  const { request } = dependencies
  if (!request) {
    throw new Error('Missing dependency parameter: request')
  }

  // return a memoized function
  return mem(initialiseSession, {maxAge: cacheDuration})

  function initialiseSession (videoId) {
    if (!videoId) {
      return Promise.reject('Missing first parameter: videoId')
    }
    return fetchVideoPage(videoId, request)
      .then(html => {
        const sessionToken = extractToken(SESSION_TOKEN_REGEX, html)
        const commentsToken = extractToken(COMMENTS_TOKEN_REGEX, html)

        return {
          commentsToken: decodeURIComponent(commentsToken),
          sessionToken
        }
      })
  }
}

function fetchVideoPage (videoId, request) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }

  if (!request) {
    return Promise.reject('Missing second parameter: request')
  }

  return request(buildVideoPageUrl(videoId))
}

function extractToken (regex, html) {
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
