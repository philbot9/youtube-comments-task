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
    const pageToken =
      'EhYSC2hfdGtJcHdic3hZwAEAyAEA4AEBGAYyEyIPIgtoX3RrSXB3YnN4WTABMAA%3D'
    const encodedPageToken = encodeURIComponent(pageToken)
    const html = `
      <div class="comment-section-renderer">
        <h2 class="comment-section-header-renderer" tabindex="0">
          <b>Comments</b> • 22<span class="alternate-content-link"></span>
        </h2>
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

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({ body: { 'watch-discussion': html } }))

    fetchFirstPageToken(videoId).fork(
      e => {
        done(`ERROR: ${JSON.stringify(e, null, 2)}`)
      },
      res => {
        expect(res).to.equal(pageToken)
        done()
      }
    )
  })

  it('task fails if API request fails', done => {
    const videoId = 'videoId'
    const errMessage = 'API request failed'
    const expectedError = { message: errMessage }

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.rejected(errMessage))

    td
      .when(
        errorHandler.scraperError({
          videoId,
          message: errMessage,
          component: 'fetch-first-page-token',
          operation: 'fetch-first-page-token'
        })
      )
      .thenReturn(expectedError)

    fetchFirstPageToken(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => done('expected to fail')
    )
  })

  it('task fails if API response is invalid', done => {
    const videoId = 'videoId'
    const expectedError = { error: 'here' }

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({ nothing: 'here' }))

    td
      .when(
        errorHandler.scraperError({
          videoId,
          message: 'Invalid API response. Missing field "watch-discussion"',
          component: 'fetch-first-page-token',
          operation: 'fetch-first-page-token'
        })
      )
      .thenReturn(expectedError)

    fetchFirstPageToken(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => done('expected to fail')
    )
  })

  it('task fails if the watch-discussion html is invalid', done => {
    const videoId = 'videoId'
    const html = '<html>Some random HTML</html>'

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({ body: { 'watch-discussion': html } }))

    fetchFirstPageToken(videoId).fork(
      e => {
        expect(e).to.be
          .a('object')
          .that.has.property('type', 'video-error/no-comments')
        done()
      },
      res => done('expected to fail')
    )
  })

  it('task fails if there are no comments', done => {
    const videoId = 'videoId'
    const expectedError = { type: 'error', error: 'here' }
    const html = `
      <div class="comment-section-renderer">
        <h2 class="comment-section-header-renderer" tabindex="0">
          <b>Comments</b><span class="alternate-content-link"></span>
        </h2>
        <div class="yt-uix-menu comment-section-sort-menu">
        </div>
      </div>`

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({ body: { 'watch-discussion': html } }))

    td
      .when(
        errorHandler.noCommentsError({
          videoId,
          component: 'fetch-first-page-token',
          operation: 'extractToken'
        })
      )
      .thenReturn(expectedError)

    fetchFirstPageToken(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => {
        done('Task should not complete.')
      }
    )
  })

  it('task fails if content_html does not contain a "Newest First" button', done => {
    const videoId = 'videoId'
    const expectedError = { type: 'error', error: 'here' }
    const html = `
      <div class="comment-section-renderer">
        <h2 class="comment-section-header-renderer" tabindex="0">
          <b>Comments</b> • 22<span class="alternate-content-link"></span>
        </h2>
        <div class="yt-uix-menu comment-section-sort-menu">
        </div>
      </div>`

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({ body: { 'watch-discussion': html } }))

    td
      .when(
        errorHandler.scraperError(
          td.matchers.contains({
            videoId,
            component: 'fetch-first-page-token',
            operation: 'fetch-first-page-token'
          })
        )
      )
      .thenReturn(expectedError)

    fetchFirstPageToken(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => {
        done('Task should not complete.')
      }
    )
  })

  it('task fails if "Newest First" button does not have a "data-token" attribute', done => {
    const videoId = 'videoId'
    const expectedError = { type: 'error', error: 'here' }
    const html = `
      <div class="comment-section-renderer">
        <h2 class="comment-section-header-renderer" tabindex="0">
          <b>Comments</b> • 22<span class="alternate-content-link"></span>
        </h2>
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
                <button type="button" class="yt-ui-menu-item comment-section-sort-menu-item" data-menu_name="n/a">
                  Newest First
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>`

    const Youtube = td.replace('../../lib/youtube-api/youtube-api')
    const errorHandler = td.replace('../../lib/error-handler')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td
      .when(Youtube.commentsWatchFragment(videoId))
      .thenReturn(Task.of({ body: { 'watch-discussion': html } }))

    td
      .when(
        errorHandler.scraperError(
          td.matchers.contains({
            videoId,
            component: 'fetch-first-page-token',
            operation: 'fetch-first-page-token'
          })
        )
      )
      .thenReturn(expectedError)

    fetchFirstPageToken(videoId).fork(
      e => {
        expect(e).to.deep.equal(expectedError)
        done()
      },
      res => {
        done('Task should not complete.')
      }
    )
  })
})
