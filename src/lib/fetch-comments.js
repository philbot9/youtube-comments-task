import Rx from 'rxjs'
import cheerio from 'cheerio'

import buildSessionStore from './session-store'
import buildCommentPageStream from './comment-page-stream'
import tokenizeComments from './tokenize-comments'
import buildRequest from './request'

export default function (videoId, config) {
  const request = buildRequest(config.fetchRetries)
  const getSession = buildSessionStore(config, {request})
  const _commentPages = buildCommentPageStream(videoId, {request, getSession})

  return _commentPages
    .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
    .map(commentToken => {
      const $comment = cheerio(commentToken)
      return {
        id: $comment.find('.comment-thread-renderer > .comment-renderer').attr('data-cid'),
        user: $comment.find('.comment-thread-renderer > .comment-renderer .comment-author-text').text()
      }
    })
}
