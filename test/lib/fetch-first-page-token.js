const test = require('blue-tape')
const td = require('testdouble')

const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

const { buildWatchFragmentsUrl } = require('../../lib/url-builder')

const noop = () => {
}

test('/lib/fetch-first-page-token.js', t => {
  t.test('- module exports a function', t => {
    t.equal(typeof fetchFirstPageToken, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const returnValue = fetchFirstPageToken().catch(() => {
    })
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is a function')
    t.end()
  })

  t.test('- promise is rejected if videoId parameter is missing', t => {
    return fetchFirstPageToken()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/videoId/.test(err), 'error is correct')
      })
      .then(() => fetchFirstPageToken(null, {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/videoId/.test(err), 'error is correct')
      })
  })

  t.test('- promise is rejected if dependencies parameter is missing', t => {
    t.plan(4)
    return fetchFirstPageToken('videoId')
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/dependencies/.test(err), 'error is correct')
      })
      .then(() => fetchFirstPageToken('videoId', null))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/dependencies/.test(err), 'error is correct')
      })
  })

  t.test('- promise is rejected if request is missing from dependencies parameter', t => {
    t.plan(4)
    return fetchFirstPageToken('videoId', {getSession: noop})
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/request/.test(err), 'error is correct')
      })
      .then(() => fetchFirstPageToken('videoId', {getSession: noop, request: null}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/request/.test(err), 'error is correct')
      })
  })

  t.test('- promise is rejected if getSession is missing from dependencies parameter', t => {
    t.plan(4)
    return fetchFirstPageToken('videoId', {request: noop})
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/getSession/.test(err), 'error is correct')
      })
      .then(() => fetchFirstPageToken('videoId', {getSession: null, request: noop}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/getSession/.test(err), 'error is correct')
      })
  })

  t.test('- promise is rejected if the page token cannot be found', t => {
    const html = '<div><div class="yadayada" token="blahblah">content</div></div>'
    const videoId = 'K3rJ5kK52'
    const sessionToken = 'the_session_token'
    const commentsToken = 'the_comments_token'
    const session = 'session'
    const pageToken = 'EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAYyESIPIgsyYTRVeGR5OVRRWTAB'

    const getSession = td.function('getSession')
    const request = td.function('request')

    td.when(getSession(videoId))
      .thenReturn(Promise.resolve(session))

    const youtubeApi = td.replace('../../lib/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(youtubeApi.fetchCommentsWatchFragment(videoId, session, request))
      .thenReturn(Promise.resolve({body: {'watch-discussion': html}}))

    return fetchFirstPageToken(videoId, {getSession, request})
      .then(result => t.notOk('Promise should not resolve'))
      .catch(err => {
        t.ok(err, 'promise rejects with an error')
        t.ok(/page token/.test(err), 'error is correct')
      })
      .then(() => td.reset())
  })

  t.test('- fetches the first page token', t => {
    const videoId = 'K3rJ5kK52'
    const sessionToken = 'the_session_token'
    const commentsToken = 'the_comments_token'
    const session = 'session'
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

    const url = buildWatchFragmentsUrl(videoId, session)
    const form = { test: 'form' }

    const getSession = td.function('getSession')
    const request = td.function('request')

    td.when(getSession(videoId))
      .thenReturn(Promise.resolve(session))

    const youtubeApi = td.replace('../../lib/youtube-api')
    const fetchFirstPageToken = require('../../lib/fetch-first-page-token')

    td.when(youtubeApi.fetchCommentsWatchFragment(videoId, session, request))
      .thenReturn(Promise.resolve({body: {'watch-discussion': html}}))

    return fetchFirstPageToken(videoId, {getSession, request})
      .then(result => t.equal(result, pageToken, 'fetches correct page token'))
      .then(() => td.reset())
  })
})
