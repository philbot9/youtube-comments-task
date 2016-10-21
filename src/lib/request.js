import rp from 'request-promise'
export const CookieJar = rp.jar()
const request = rp.defaults({
  jar: CookieJar
})

import retry from './retry'

export default function buildRequest (retries = 3) {
  return function (...args) {
    return retry(() => request(...args), retries)
  }
}
