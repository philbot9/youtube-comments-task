import Rx from 'rxjs'

import buildSessionStore from './session-store'
import buildCommentPageStream from './comment-page-stream'
import tokenizeComments from './tokenize-comments'
import buildRequest from './request'
import parseComment from './parse-comment'
import prepareRepliesStreamBuilder from './comment-replies-stream'

export default function (videoId, config) {
  const request = buildRequest(config.fetchRetries)
  const getSession = buildSessionStore(config, {request})
  const buildRepliesStream = prepareRepliesStreamBuilder()
  const _commentPages = buildCommentPageStream(videoId, {request, getSession})

  return _commentPages
    .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
    .concatMap(parseComment)
    .concatMap(comment => config.includeReplies ? buildRepliesStream(comment) : comment)
}
