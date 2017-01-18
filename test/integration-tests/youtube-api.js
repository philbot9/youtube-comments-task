const test = require('tape')
const cheerio = require('cheerio')

const fetchFirstPageToken = require('../../lib/fetch-first-page-token')
const youtubeApi = require('../../lib/youtube-api/youtube-api')

test('/lib/youtube-api', t => {
  t.test('- fetches comment page', t => {
    const videoId = 'E9Fmewoe5L4'
    fetchFirstPageToken(videoId)
      .chain(token => youtubeApi.commentPage(videoId, token))
      .fork(e => {
        t.fail(e)
        t.end()
      }, p => {
        t.ok(p.content_html, 'response has content_html field')
        const $ = cheerio.load(p.content_html)
        t.ok($('.comment-thread-renderer').length > 1, 'content_html has comment-thread-renderers')
        t.ok($('.comment-renderer').length > 1, 'content_html has comment-renderers')
        t.end()
      })
  })

  t.test('- fetches comment replies', t => {
    const videoId = 'tVjv8I0BlU4'
    const repliesToken = 'EhYSC3RWanY4STBCbFU0wAEAyAEA4AEBGAYyWRpXEiN6MTJ1eGJjcm1wYWZ2anBxMjA0Y2dwcDQ1bm14anpxNGQxMCICCAAqGFVDWDFRcHRpZ2NzYkJ1YlZxdEIxSks3ZzILdFZqdjhJMEJsVTQ4AEABSPQD'
    youtubeApi.commentReplies(videoId, repliesToken)
      .fork(e => {
        t.fail(e)
        t.end()
      }, r => {
        t.ok(r.content_html, 'response has content_html field')
        const $ = cheerio.load(r.content_html)
        t.ok($('.comment-renderer').length > 1, 'content_html has comment-renderers')
        t.end()
      })
  })

  t.test('- fetches comments watch fragment', t => {
    const videoId = 'tVjv8I0BlU4'
    youtubeApi.commentsWatchFragment(videoId)
      .fork(e => {
        t.fail(e)
        t.end()
      }, res => {
        t.ok(res.name, 'response contains name')
        t.ok(res.body, 'response contains body')
        t.ok(res.body['watch-discussion'], 'response contains body.watch-discussion')
        t.ok(res.foot, 'response contains foot')

        const $ = cheerio.load(res.body['watch-discussion'])
        t.ok($('.comment-thread-renderer').length > 1, 'body has comment-thread-renderers')
        t.ok($('.comment-renderer').length > 1, 'body has comment-renderers')
        t.end()
      })
  })
})
