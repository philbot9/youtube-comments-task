const mem = require('mem')
const Task = require('data.task')
const Either = require('data.either')

const { buildVideoPageUrl } = require('./url-builder')
const request = require('../utils/request')
const retry = require('../utils/retry-task')

const extractToken = (html, regex) => {
  const m = regex.exec(html)
  return m && m.length == 2
    ? Either.of(decodeURIComponent(m[1]))
    : Either.Left(`Cannot extract token using ${regex.toString()}`)
}

const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

const extractSessionToken = html =>
  extractToken(html, /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/i)

const extractCommentsToken = html =>
  extractToken(html, /\'COMMENTS_TOKEN\'\s*\n*:\s*\n*"(.*)"/i)

const fetchVideoPage = videoId =>
  request(buildVideoPageUrl(videoId))


module.exports = ({ cacheDuration = (1000 * 60 * 5), fetchRetries = 3 }) => {
  const withRetries = retry(fetchRetries)
  const fetchVideoPageWithRetries = (videoId) => withRetries(() => fetchVideoPage(videoId))

  const initializeSession = (videoId) => {
    return fetchVideoPageWithRetries(videoId)
      .chain(html => Task.of(sessionToken => commentsToken => ({sessionToken, commentsToken}))
        .ap(eitherToTask(extractSessionToken(html)))
        .ap(eitherToTask(extractCommentsToken(html))))
  }

  // return a memoized function
  return mem(initializeSession, {maxAge: cacheDuration})
}
