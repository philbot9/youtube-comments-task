const cheerio = require('cheerio')

const tokenizeComments = html =>
  cheerio.load(html)('.comment-thread-renderer').toArray()

module.exports = tokenizeComments
