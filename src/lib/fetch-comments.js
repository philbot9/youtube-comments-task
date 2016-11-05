import Rx from 'rxjs'

import buildSessionStore from './session-store'
import buildCommentPageStream from './comment-page-stream'
import tokenizeComments from './tokenize-comments'
import buildRequest from './request'
import parseComment from './parse-comment'

export default function (videoId, config) {
  const request = buildRequest(config.fetchRetries)
  const getSession = buildSessionStore(config, {request})
  const _commentPages = buildCommentPageStream(videoId, {request, getSession})

  return _commentPages
    .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
    .concatMap(parseComment)
    //.concatMap(fetchReplies)
}
