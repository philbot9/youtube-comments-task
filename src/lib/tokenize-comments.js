const Either = require('data.either')
const { cheerio } = require('./utils/cheerio-utils')

const tokenizeComments = html => Either.fromNullable(cheerio.load(html))
  .map($ => $('.comment-thread-renderer').toArray())
  .map(cs => cs.map(cheerio))

module.exports = tokenizeComments
