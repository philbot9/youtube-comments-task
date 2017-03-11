const Task = require('data.task')
const Either = require('data.either')
const { liftM2 } = require('control.monads')
const { delayedRetry } = require('retry-task')

const eitherToTask = require('../utils/either-to-task')
const { buildVideoPageUrl } = require('./url-builder')
const request = require('../utils/request')
const { videoPageError } = require('../error-handler')

const extractToken = (html, regex) =>
  Either.fromNullable(regex.exec(html))
    .chain(m => Either.fromNullable(m[1]))
    .map(token => decodeURIComponent(token))

const extractSessionToken = html =>
  extractToken(html, /'XSRF_TOKEN'\s*\n*:\s*\n*"(.*)"/i)
    .leftMap(_ => videoPageError({
      component: 'session-store',
      operation: 'extractSessionToken',
      html
    }))

const extractCommentsToken = html =>
  extractToken(html, /'COMMENTS_TOKEN'\s*\n*:\s*\n*"([^"]+)"/i)
    .leftMap(_ => videoPageError({
      component: 'session-store',
      operation: 'extractCommentsToken',
      html
    }))

// TODO: make # retries configurable
const withRetries = delayedRetry(3, n => n * n * 500)

const fetchVideoPage = videoId =>
  request(buildVideoPageUrl(videoId))

const fetchVideoPageWithRetries = videoId =>
  withRetries(() => fetchVideoPage(videoId))

const buildSession = (sessionToken, commentsToken) =>
  ({sessionToken, commentsToken})

const getSession = videoId =>
  fetchVideoPageWithRetries(videoId)
    .chain(html => liftM2(
      buildSession,
      eitherToTask(extractSessionToken(html)),
      eitherToTask(extractCommentsToken(html))))

// TODO: make cacheTtl configurable
const cacheTtl = 1000 * 60 * 5 // 5 minutes
const cache = {}

/*
 * NOTE: this function is impure (shame on me), but I don't know how else to
 *       memoize lazy async operations.
 */
const memoizedGetSession = videoId => {
  const cached = cache[videoId]
  if (cached && cached.maxAge > Date.now()) {
    return Task.of(cached.data)
  }

  return getSession(videoId)
    .map(res =>
      (cache[videoId] = {
        data: res,
        maxAge: Date.now() + cacheTtl
      }).data)
}

module.exports = memoizedGetSession
