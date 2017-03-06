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
    const pageToken = 'EhYSC2hfdGtJcHdic3hZwAEAyAEA4AEBGAYyEyIPIgtoX3RrSXB3YnN4WTABMAA%3D'
    const encodedPageToken = encodeURIComponent(pageToken)
    const html = `
      <div>
        <div class="yt-uix-menu comment-section-sort-menu">
          <button class="yt-uix-button yt-uix-button-size-default" type="button">Button</button>
          <div class="yt-uix-menu-content yt-ui-menu-content" role="menu"
            <ul tabindex="0" class="yt-uix-kbd-nav yt-uix-kbd-nav-list">
              <li>
                <button type="button" class="yt-ui-menu-item comment-section-sort-menu-item" data-token="WROOOONG" data-menu_name="n/a">
                  Not it
                </button>
              </li>
              <li>
                <button type="button" class="yt-ui-menu-item comment-section-sort-menu-item" data-token="${encodedPageToken}" data-menu_name="n/a">
                  Newest First
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>`

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({body: {'watch-discussion': html}}))

    fetchFirstPageToken(videoId)
      .fork(e => {
        done(`ERROR: ${e}`)
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
