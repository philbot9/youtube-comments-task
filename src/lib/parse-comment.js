import moment from 'moment'

export default function ($commentThread) {
  // extract the original comment only (ignore replies)
  const $comment = $commentThread.find('.comment-thread-renderer > .comment-renderer')

  const likesStr = $commentThread.find('.comment-action-buttons-toolbar > .comment-renderer-like-count.on').text();
  let likes = 0
  if (likesStr) {
    likes = parseInt(likesStr, 10) - 1
  }

  const fromNow = $comment.find('.comment-renderer-header > .comment-renderer-time').text().trim()
  const timestamp = parseFromNow(fromNow)

  return {
    hasReplies: ($commentThread.find('.comment-thread-renderer > .comment-replies-renderer').children().length > 0),
    id: $comment.attr('data-cid'),
    user: $comment.find('.comment-renderer-header > .comment-author-text').text().trim(),
    text: $comment.find('.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').text().trim(),
    fromNow,
    timestamp,
    likes
  }
}

function parseFromNow (fromNow) {
  const m = /(\d+)\s(\w+)\sago$/.exec(fromNow)
  if (!m || m.length !== 3) return undefined

  return moment()
    .subtract(m[1], m[2].replace(/s$/i, ''))
    .valueOf()
}
