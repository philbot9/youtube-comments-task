const moment = require('moment')

module.exports = ($commentThread) => {
  const $repliesContainer = $commentThread.find('.comment-replies-renderer > div')
  const repliesInfo = extractRepliesInfo($repliesContainer)

  const $comment = $commentThread.find('.comment-thread-renderer > .comment-renderer')
  const likesStr = $commentThread.find('.comment-action-buttons-toolbar > .comment-renderer-like-count.on').text();
  let likes = 0
  if (likesStr) {
    likes = parseInt(likesStr, 10) - 1
  }

  const fromNow = $comment.find('.comment-renderer-header > .comment-renderer-time').text().trim()
  const timestamp = parseFromNow(fromNow)

  return Object.assign({}, repliesInfo, {
    id: $comment.attr('data-cid'),
    user: $comment.find('.comment-renderer-header > .comment-author-text').text().trim(),
    text: $comment.find('.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').text().trim(),
    fromNow,
    timestamp,
    likes
  })
}

function extractRepliesInfo ($repliesContainer) {
  if (!$repliesContainer.length) {
    return {
      hasReplies: false,
      numReplies: 0
    }
  }

  let repliesToken = $repliesContainer
    .find('div > button:nth-of-type(1)')
    .attr('data-uix-load-more-post-body')
    .replace(/^page_token=/i, '')
    .trim()
  repliesToken = decodeURIComponent(repliesToken)

  const btnText = $repliesContainer
    .find('div > button:nth-of-type(1) .load-more-text')
    .text()
    .trim()

  const m = btnText.match(/^View (?:all\s)?(\d+)/i)
  const numReplies = m && m[1] ? parseInt(m[1], 10) : 1

  return { hasReplies: true, repliesToken, numReplies }
}

function parseFromNow (fromNow) {
  const m = /(\d+)\s(\w+)\sago$/.exec(fromNow)
  if (!m || m.length !== 3) return undefined

  return moment()
    .subtract(m[1], m[2].replace(/s$/i, ''))
    .valueOf()
}
