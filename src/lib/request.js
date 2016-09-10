import rp from 'request-promise'
export const CookieJar = rp.jar()
const request = rp.defaults({
  jar: CookieJar
})

export default function (...args) {
  return request(...args)
}
