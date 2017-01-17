const test = require('tape')
const extractNextPageToken = require('../../lib/extract-next-page-token')

test('/lib/extract-next-page-token', t => {
  t.test('- extractNextPageToken() throws an error if correct button element is missing', t => {
    const html = '<html><button class="yt-ui-nonsense">Not it!</button></html>'
    t.throws(() => extractNextPageToken(html), /button element/i)
    t.end()
  })

  t.test("- extractNextPageToken() throws an error if button doesn't have page token attribute", t => {
    const html = '<html><button class="comment-section-renderer-paginator">Not it!</button></html>'
    t.throws(() => extractNextPageToken(html), /attribute/i)
    t.end()
  })

  t.test('- extractNextPageToken() returns the nextPageToken', t => {
    const nextPageToken = 'EhYSC0szYUN1S0JXRTNBwAEAyAEA4AEBGAYyWRpXEiN6MTJ2ZWJ2eHRyemd3MWlrYjIzMXhicHB1d2U0anZoYWcwNCICCAAqGFVDNTBxQjFtZk5OQmY4ZVNoWDAxNXc1UTILSzNhQ3VLQldFM0E4AEABSPQD'
    const html = [
      '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more comment-section-renderer-paginator yt-uix-sessionlink" type="button" onclick=";return false;" aria-label="Show more" data-uix-load-more-href="/comment_service_ajax?action_get_comments=1" data-uix-load-more-post="true" data-sessionlink="itct=CAEQuy8iEwil05qF1YfPAhVOL04KHT7rAEU" data-uix-load-more-target-id="comment-section-renderer-items" data-uix-load-more-post-body=',
      `"page_token=${nextPageToken}"`,
      'data-sessionlink-target="/comment_service_ajax?action_get_comments=1"><span class="yt-uix-button-content">  <span class="load-more-loading hid">',
      '<span class="yt-spinner"><span title="Loading icon" class="yt-spinner-img  yt-sprite"></span>Loading...</span></span>',
      '<span class="load-more-text">Show more</span></span></button>'
    ].join('')

    const returnValue = extractNextPageToken(html)
    t.equal(returnValue, nextPageToken)
    t.end()
  })
})
