const debug = require('debug')('request')
const req = require('request')
const Task = require('data.task')

module.exports = opts =>
  new Task((rej, res) => {
    const optsWithJar = typeof opts === 'string'
      ? Object.assign({}, { jar: req.jar() }, { url: opts })
      : Object.assign({}, { jar: req.jar() }, opts)

    debug('sending request: %o', optsWithJar)

    req(optsWithJar, (err, response, body) => {
      if (err) {
        debug('request failed', err)
        rej(err)
      } else if (response.statusCode !== 200) {
        debug('request failed', response.statusCode)
        rej(`Request failed, Status ${response.statusCode}`)
      } else {
        res({ body, cookieJar: optsWithJar.jar })
      }
    })
  })
