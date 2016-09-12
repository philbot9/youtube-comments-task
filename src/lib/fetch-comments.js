import Rx from 'rxjs'
import cheerio from 'cheerio'

import buildSessionStore from './session-store'
import buildCommentPageStream from './comment-pages'
import tokenizeComments from './tokenize-comments'

export default function (videoId, config) {
  const getSession = buildSessionStore(config)
  const commentPages = buildCommentPageStream(videoId, getSession)

  return commentPages
    .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
    .map(commentToken => {
      const $comment = cheerio(commentToken)
      return {
        id: $comment.find('.comment-thread-renderer > .comment-renderer').attr('data-cid'),
        user: $comment.find('.comment-thread-renderer > .comment-renderer .comment-author-text').text()
      }
    })
}
