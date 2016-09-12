import cheerio from 'cheerio'

export default function (html) {
  if (!html) {
    throw new Error('Missing parameter: html')
  }

  const $ = cheerio.load(html)
  const tokens = []
  $('.comment-thread-renderer').each(function () {
    tokens.push($($(this)))
  })
  return tokens
}
