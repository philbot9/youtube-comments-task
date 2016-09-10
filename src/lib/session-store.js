import importedRequest from './request'

export const URL_TEMPLATE = 'https://www.youtube.com/watch?v={{videoId}}'

export default function (config = {}, deps = {}) {
  const { cacheDuration = 1000 * 60 * 30 } = config
  const { request = importedRequest } = deps
  const cache = {}

  return (videoId) => {
    if (cache[videoId]) {
      const cached = cache[videoId]
      if (cached.expires > Date.now()) {
        return Promise.resolve(cached.value)
      }
    }

    return request.get(URL_TEMPLATE.replace('{{videoId}}', videoId))
      .then(responseText => {
        const m = /\'XSRF_TOKEN\'\s*\n*:\s*\n*"(.*)"/.exec(responseText)

        if (!m || m.length !== 2) {
          throw new Error('Cannot find session token')
        }

        const sessionToken = m[1]

        cache[videoId] = {
          expires: Date.now() + cacheDuration,
          value: sessionToken
        }

        return sessionToken
      })
  }
}
