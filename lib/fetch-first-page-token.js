const cheerio = require('cheerio')
const { fetchCommentsWatchFragment } = require('./youtube-api')

module.exports = (videoId, dependencies) => {
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

  return getSession(videoId)
    .then(session => fetchCommentsWatchFragment(videoId, session, request))
    .then(response => {
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
    })
}
