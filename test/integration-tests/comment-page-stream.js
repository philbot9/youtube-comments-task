const test = require('tape')
const cheerio = require('cheerio')

const buildCommentPageStream = require('../../lib/comment-page-stream')

test('/lib/comment-page-stream', t => {
  t.test('- fetches comment pages', t => {
    const results = []
    buildCommentPageStream('9bZkp7q19f0')
      .take(3)
      .subscribe({
        next: p => results.push(p),
        error: e => {
          t.fail(e)
          t.end()
        },
        complete: () => {
          t.equal(results.length, 3)
          results.forEach(html => {
            const $ = cheerio.load(html)
            t.ok($('.comment-thread-renderer').length > 1, 'page has comment-thread-renderers')
            t.ok($('.comment-renderer').length > 1, 'page has comment-renderers')
          })
          t.end()
        }
      })
  })
})
