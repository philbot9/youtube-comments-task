const Rx = require('rxjs')

const buildCommentPageStream = require('./comment-page-stream')
const tokenizeComments = require('./tokenize-comments')
const parseCommentThread = require('./parse-comment-thread')

module.exports = videoId =>
  buildCommentPageStream(videoId)
    .concatMap(tokenizeComments)
    .map($commentThread =>
      parseCommentThread($commentThread)
        .fold(e => { throw new Error(e) },
              c => c))
    // .concatMap(html =>
    //     tokenizeComments(html)
    //       .fold(e => { throw new Error(e) },
    //             c => Rx.Observable.from(c)))

  // const request = buildRequest(config.fetchRetries)
  // const getSession = buildSessionStore(config, {request})
  // const buildRepliesStream = prepareRepliesStreamBuilder()
  // const _commentPages = buildCommentPageStream(videoId, {request, getSession})

  // return _commentPages
  //   .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
  //   .map(parseComment)
  //   .concatMap(comment => config.includeReplies ? buildRepliesStream(comment) : comment)
