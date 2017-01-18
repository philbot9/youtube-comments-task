const test = require('tape')

const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

test('/lib/youtube-api', t => {
  t.test('- fetches first page token', t => {
    fetchFirstPageToken('E9Fmewoe5L4')
      .fork(e => {
        t.fail(e)
        t.end()
      }, token => {
        t.ok(token, 'fetched token')
        t.equal(token.length, 64, 'token is 64 chars long')
        t.ok(/[\w\d]+=$/.test(token), 'token is valid')
        t.end()
      })
  })
})
