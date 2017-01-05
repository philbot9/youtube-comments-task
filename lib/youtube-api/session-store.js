const mem = require('mem')
const Task = require('data.task')
const Either = require('data.either')
const { liftM2 } = require('control.monads')

const eitherToTask = require('../utils/either-to-task')
const { buildVideoPageUrl } = require('./url-builder')
const request = require('../utils/request')
const retry = require('../utils/retry-task')

const extractToken = (html, regex) =>
  Either.fromNullable(regex.exec(html))
    .chain(m => Either.fromNullable(m[1]))
    .map(token => decodeURIComponent(token))

const extractSessionToken = html =>
  extractToken(html, /'XSRF_TOKEN'\s*\n*:\s*\n*"(.*)"/i)
    .leftMap(_ => `Cannot extract session token from ${html}`)

const extractCommentsToken = html =>
  extractToken(html, /'COMMENTS_TOKEN'\s*\n*:\s*\n*"(.*)"/i)
    .leftMap(_ => `Cannot extract commnents token from ${html}`)

// TODO: make # retries configurable
const withRetries = retry(3)

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

// export a memoized function that caches the result for up to 5 minutes
// TODO: make cache duration configurable
module.exports = mem(getSession, {maxAge: (1000 * 60 * 5)})
