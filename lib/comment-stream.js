const Rx = require('rxjs')

// const buildSessionStore = require('./session-store')
const buildCommentPageStream = require('./comment-page-stream')
const tokenizeComments = require('./tokenize-comments')
// const buildRequest = require('./request')
const parseComment = require('./parse-comment')
const prepareRepliesStreamBuilder = require('./comment-replies-stream')

module.exports = (videoId, config) => {

  // const request = buildRequest(config.fetchRetries)
  // const getSession = buildSessionStore(config, {request})
  // const buildRepliesStream = prepareRepliesStreamBuilder()
  // const _commentPages = buildCommentPageStream(videoId, {request, getSession})

  // return _commentPages
  //   .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
  //   .map(parseComment)
  //   .concatMap(comment => config.includeReplies ? buildRepliesStream(comment) : comment)
}
