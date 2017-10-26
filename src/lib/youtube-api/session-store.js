const Task = require('data.task')
const Either = require('data.either')
const { liftMN } = require('control.monads')
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
  extractToken(html, /'XSRF_TOKEN'\s*\n*:\s*\n*"(.*)"/i).leftMap(_ =>
    videoPageError({
      component: 'session-store',
      operation: 'extractSessionToken',
      html
    })
  )

const extractCommentsToken = html =>
  extractToken(html, /'COMMENTS_TOKEN'\s*\n*:\s*\n*"([^"]+)"/i).leftMap(_ =>
    videoPageError({
      component: 'session-store',
      operation: 'extractCommentsToken',
      html
    })
  )

// TODO: make # retries configurable
const withRetries = delayedRetry(3, n => n * n * 500)

const fetchVideoPage = videoId => request(buildVideoPageUrl(videoId))

const fetchVideoPageWithRetries = videoId =>
  withRetries(() => fetchVideoPage(videoId))

const buildSession = (sessionToken, commentsToken, cookieJar) => ({
  sessionToken,
  commentsToken,
  cookieJar
})

const getSession = videoId =>
  fetchVideoPageWithRetries(videoId).chain(({ body, cookieJar }) =>
    liftMN(buildSession, [
      eitherToTask(extractSessionToken(body)),
      eitherToTask(extractCommentsToken(body)),
      Task.of(cookieJar)
    ])
  )

// TODO: make cacheTtl configurable
const cacheTtl = 1000 * 60 * 2 // 2 minutes
const cache = {}

/*
 * NOTE: this function is impure (shame on me), but I don't know how else to
 *       cache lazy async operations.
 */
const cachedGetSession = videoId => {
  const cached = cache[videoId]
  if (cached && cached.data && cached.maxAge > Date.now()) {
    return Task.of(cached.data)
  } else if (cached && cached.maxAge <= Date.now()) {
    delete cache[videoId]
  }

  return getSession(videoId).map(res => {
    cache[videoId] = {}
    cache[videoId].data = Object.assign({}, res)
    cache[videoId].maxAge = Date.now() + cacheTtl
    return res
  })
}

module.exports = cachedGetSession
