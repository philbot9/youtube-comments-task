import test from 'blue-tape'
import sinon from 'sinon'

import fetchFirstPageToken, {
  fetchCommentsFragment,
  extractPageToken
} from '../../lib/fetch-first-page-token'

import { buildWatchFragmentsUrl } from '../../lib/url-builder'

test('/lib/fetch-first-page-token.js', t => {
  t.test('- module exports a function', t => {
    t.equal(typeof fetchFirstPageToken, 'function', 'is of type function')
    t.end()
  })

  t.test('- function returns a promise', t => {
    const returnValue = fetchFirstPageToken().catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is a function')
    t.end()
  })

  t.test('- rejects promise if required parameters missing', t => {
    return fetchFirstPageToken()
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
      .then(() => fetchFirstPageToken(null, () => {}))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
      .then(() => fetchFirstPageToken('videoId'))
      .then(() => t.fail('promise should not resolve'))
      .catch((err) => {
        t.ok(err, 'promise is rejected with an error')
      })
  })

  t.test('- fetchCommentsFragment() returns a promise', t => {
    const returnValue = fetchCommentsFragment().catch(() => {})
    t.ok(returnValue.then, 'return value has .then')
    t.equal(typeof returnValue.then, 'function', '.then is a function')
    t.end()
  })

  t.test('- fetchCommentsFragment() rejects promise if required parameters are missing', t => {
    return fetchCommentsFragment()
    .then(() => t.fail('promise should not resolve'))
    .catch((err) => {
      t.ok(err, 'promise is rejected with an error')
    })
    .then(() => fetchCommentFragment('videoId'))
    .then(() => t.fail('promise should not resolve'))
    .catch((err) => {
      t.ok(err, 'promise is rejected with an error')
    })
  })

  t.test('- fetchCommentsFragment() fetches a comments fragment', t => {
    const videoId = 'K3rJ5kK52'
    const sessionToken = 'the_session_token'
    const commentsToken = 'the_comments_token'
    const session = {
      sessionToken,
      commentsToken
    }

    const url = buildWatchFragmentsUrl(videoId, commentsToken)
    const getSession = sinon.stub().returns(Promise.resolve(session))
    const request = sinon.stub().returns(Promise.resolve())

    return fetchCommentsFragment(videoId, getSession, request)
      .then(() => {
        t.ok(request.calledOnce, 'request called once')
        t.deepEqual(request.firstCall.args[0], {
          method: 'POST',
          json: true,
          form: {session_token: sessionToken},
          url
        }, 'request called with correct parameters')
      })
  })

  t.test('- extractPageToken() throws an error on missing parameter', t => {
    t.throws(() => extractPageToken(), 'throws an error')
    t.end()
  })

  t.test('- extractPageToken() throws an error if watch-discussion is missing from response', t => {
    t.throws(() => extractPageToken({'nothing': 'here'}), 'throws an error')
    t.throws(() => extractPageToken({'body': {'nothing': 'here'}}), 'throws an error')
    t.end()
  })

  t.test('- extractPageToken() throws an error if the page token cannot be found', t => {
    const html = '<div><div class="yadayada" token="blahblah">content</div></div>'
    t.throws(() => extractPageToken({body: {'watch-discussion': html}}))
    t.end()
  })

  t.test('- extractPageToken() does not extract the "Load more" page token', t => {
    const html = [
      '<div>',
      '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-section-renderer-paginator yt-uix-sessionlink selectorgadget_suggested" type="button" onclick=";return false;" aria-label="Show more" data-sessionlink="itct=CAEQuy8iEwjk_-eHu4XPAhXKL04KHeSwCbI" data-uix-load-more-post-body="page_token=EhYSCzJhNFV4ZHk5VFFZwAEAyAEA4AEBGAYywgIKrgJDZzBRbm9ic2g3dUZ6d0lnQUNnQkVzSUJDQUFROEx5djhxcUZ6d0lxdEFIcnBaRGNtNXE2N3p1NTA1bWotTkdvd0R2aWdfX3EyOFgtcERpSTFZdUY3b3Vka1RuRm9NclM3cEtkdkRxT3JxWF9zcWp5eFRuTTZZeTU3SmJMNkRxNnh0cWVsY2I2cXp1VDhaLXc0b3JLOURpUXRMdnEtdHZydlRpUjM3eVJ5THlOdXp2R3Z0UHBnN2plX1R1aXItdUR3OFM1NER2ZjdNRzloT2ZuNlRtXzM2dlBzZkNmZ3pqSF82cTUyZGUyOWpuTDFQNmRudU9tM2pyOXplM0o1WVdDbGppMjVvbWZsY3I1LVRpanVzZkE5N3VwOVRvWUFTQVVLS3o1LThtV2c5S0JMZyIPIgsyYTRVeGR5OVRRWTAA" data-uix-load-more-post="true" data-uix-load-more-href="/comment_service_ajax?action_get_comments=1" data-sessionlink-target="/comment_service_ajax?action_get_comments=1" data-uix-load-more-target-id="comment-section-renderer-items">',
      'Loading More',
      '</button>',
      '<div>'
    ].join('')

    t.throws(() => extractPageToken({body: {'watch-discussion': html}}), 'throws an error')
    t.end()
  })

  t.test('- extractPageToken() extracts the correct page token', t => {
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

    const result = extractPageToken({body: {'watch-discussion': html}})
    t.equal(result, pageToken, 'extracts page token correctly')
    t.end()
  })

  t.test('- module fetches the first page token', t => {
    const videoId = 'K3rJ5kK52'
    const sessionToken = 'the_session_token'
    const commentsToken = 'the_comments_token'
    const session = {
      sessionToken,
      commentsToken
    }
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

    const url = buildWatchFragmentsUrl(videoId, commentsToken)
    const getSession = sinon.stub().returns(Promise.resolve(session))
    const request = sinon.stub().returns(Promise.resolve({body: {'watch-discussion': html}}))

    return fetchFirstPageToken(videoId, getSession, { request })
      .then(result => t.equal(result, pageToken, 'fetches correct page token'))
  })
})
