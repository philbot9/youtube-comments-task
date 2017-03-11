const debug = require('debug')('request')
const req = require('request').defaults({jar: true})
const Task = require('data.task')

module.exports = (opts) =>
  new Task((rej, res) => {
    debug('sending request: %o', opts)
    req(opts, (err, response, body) => {
      if (err) {
        rej(err)
      } else if (response.statusCode !== 200) {
        rej(`Request failed, Status ${response.statusCode}`)
      } else {
        res(body)
      }
    })
  })
