const mem = require('mem')
const Task = require('data.task')
const Either = require('data.either')

const { buildVideoPageUrl } = require('./url-builder')
const request = require('../utils/request')
const retry = require('../utils/retry-task')

const extractToken = (html, regex) => {
  const m = regex.exec(html)
  return m && m.length === 2
    ? Either.of(decodeURIComponent(m[1]))
    : Either.Left(`Cannot extract token using ${regex.toString()} from ${html}`)
}

const extractSessionToken = html =>
  extractToken(html, /'XSRF_TOKEN'\s*\n*:\s*\n*"(.*)"/i)

const extractCommentsToken = html =>
  extractToken(html, /'COMMENTS_TOKEN'\s*\n*:\s*\n*"(.*)"/i)

const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

// TODO: make # retries configurable
const withRetries = retry(3)

const fetchVideoPage = videoId =>
  request(buildVideoPageUrl(videoId))

const fetchVideoPageWithRetries = videoId =>
  withRetries(() => fetchVideoPage(videoId))

const buildSession = sessionToken => commentsToken =>
  ({sessionToken, commentsToken})

const getSession = videoId =>
  fetchVideoPageWithRetries(videoId)
    .chain(html => Task.of(buildSession)
      .ap(eitherToTask(extractSessionToken(html)))
      .ap(eitherToTask(extractCommentsToken(html))))

// export a memoized function that caches the result for up to 5 minutes
// TODO: make cache duration configurable
module.exports = mem(getSession, {maxAge: (1000 * 60 * 5)})
