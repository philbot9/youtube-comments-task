const { expect } = require('chai')
const td = require('testdouble')
const Task = require('data.task')

describe('/lib/fetch-first-page-token.js', () => {
  afterEach(() => {
    td.reset()
  })

  it('module exports a function', () => {
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')
    expect(fetchFirstPageToken).to.be.a('function')
  })

  it('fetches the first page token', done => {
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
      .fork(e => {
        expect.fail(e)
        done(e)
      }, res => {
        expect(res).to.equal(pageToken)
        done()
      })
  })

  it('task fails if API request fails', done => {
    const videoId = 'videoId'
    const errMessage = 'API request failed'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.rejected(errMessage))

    fetchFirstPageToken(videoId)
      .fork(e => {
        expect(e).to.equal(errMessage)
        done()
      }, res => done('expected to fail'))
  })

  it('task fails if API response is invalid', done => {
    const videoId = 'videoId'
    const errMessage = 'API request failed'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({nothing: 'here'}))

    fetchFirstPageToken(videoId)
      .fork(e => {
        expect(e).to.be.a('string')
        expect(e).to.match(/invalid api response/i)
        done()
      }, res => done('expected to fail'))
  })

  it('task fails if the page token cannot be found', done => {
    const videoId = 'videoId'
    const html = '<html>Some random HTML</html>'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({'watch-discussion': html}))

    fetchFirstPageToken(videoId)
      .fork(e => {
        expect(e).to.be.a('string')
        done()
      }, res => done('expected to fail'))
  })
})
