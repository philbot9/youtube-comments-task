const rp = require('request-promise')
const CookieJar = rp.jar()
const request = rp.defaults({
  jar: CookieJar
})

const retry = require('./retry')

const buildRequest = (retries = 3) => {
  return (arg) => {
    return retry(() => request(arg), retries)
  }
}

module.exports = buildRequest
