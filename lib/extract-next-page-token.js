const cheerio = require('cheerio')

module.exports = html => {
  if (!html) {
    return null
  }

  const $ = cheerio.load(html)
  const $btn = $('button.comment-section-renderer-paginator')
  if (!$btn.length) {
    throw new Error('Cannot find button element')
  }

  const attrValue = $btn.attr('data-uix-load-more-post-body')
  if (!attrValue) {
    throw new Error("Button element doesn't have a page token attribute")
  }

  return decodeURIComponent(attrValue.replace(/^page_token=/i, ''))
}
