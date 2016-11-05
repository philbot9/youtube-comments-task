export default function ($commentThread) {
  // extract the original comment only (ignore replies)
  const $comment = $commentThread.find('.comment-thread-renderer > .comment-renderer')

  return {
    hasReplies: ($commentThread.find('.comment-thread-renderer > .comment-replies-renderer').children().length > 0),
    id: $comment.attr('data-cid'),
    user: $comment.find('.comment-renderer-header > .comment-author-text').text().trim()
  }
}
