const test = require('tape')
const td = require('testdouble')
const Task = require('data.task')

test('/lib/fetch-first-page-token.js', t => {
  t.test('- module exports a function', t => {
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')
    t.equal(typeof fetchFirstPageToken, 'function', 'is of type function')
    t.end()
  })

  t.test('- fetches the first page token', t => {
    const videoId = 'videoId'
    const pageToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAYyESIPIgsyYTRVeGR5OVRRWTAB'
    const html = [
      '<div>div class="comment-section-sort-menu"><div class="yt-uix-menu-content">',
      '<ul>',
      '<li>',
      '<button data-token="EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAYyESIPIgsyYTRVeGR5OVRRWTAA">false</button>',
      '</li>',
      '<li>',
      '<button data-menu_name="newest-first" data-token="' + pageToken + '">real</button>',
      '</li>',
      '</ul>',
      '</div></div></div>'
    ].join('')

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({body: {'watch-discussion': html}}))

    fetchFirstPageToken(videoId)
      .fork(t.fail,
            res => {
              t.equal(res, pageToken)
              td.reset()
              t.end()
            })
  })

  t.test('- task fails if API request fails', t => {
    const videoId = 'videoId'
    const errMessage = 'API request failed'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.rejected(errMessage))

    fetchFirstPageToken(videoId)
      .fork(e => {
        t.equal(e, errMessage)
        td.reset()
        t.end()
      }, t.fail)
  })

  t.test('- task fails if API response is invalid', t => {
    const videoId = 'videoId'
    const errMessage = 'API request failed'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({nothing: 'here'}))

    fetchFirstPageToken(videoId)
      .fork(e => {
        t.ok(/invalid api response/i.test(e), 'correct error')
        td.reset()
        t.end()
      }, t.fail)
  })

  t.test('- task fails if the page token cannot be found', t => {
    const videoId = 'videoId'
    const html = '<html>Some random HTML</html>'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({'watch-discussion': html}))

    fetchFirstPageToken(videoId)
      .fork(e => {
        t.ok(e, 'error exists')
        td.reset()
        t.end()
      }, t.fail)
  })
})
