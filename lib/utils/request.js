const request = require('request').defaults({jar: true})
const Task = require('data.task')

module.exports = (opts) =>
  new Task((rej, res) => {
    request(opts, (error, response, body) => {
      if (err) {
        rej(err)
      } else if (response.statusCode !== 200) {
        rej(`Request failed, Status ${responseCode.statusCode}`)
      } else {
        res(body)
      }
    })
  })
