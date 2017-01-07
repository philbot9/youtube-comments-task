const { cheerio, cheerioFindAll } = require('./utils/cheerio-utils')

const tokenizeComments = html =>
  cheerio.load(html)('.comment-thread-renderer').toArray().map(cheerio)

module.exports = tokenizeComments
