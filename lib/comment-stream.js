const Rx = require('rxjs')

const buildCommentPageStream = require('./comment-page-stream')
const tokenizeComments = require('./tokenize-comments')
const parseCommentThread = require('./parse-comment-thread')
const fetchReplies = require('./fetch-replies')

const fetchCommentReplies = (videoId, comment) =>
  Rx.Observable.create(observer =>
    fetchReplies(videoId, comment)
        .fork(e => { throw new Error(e) },
              r => observer.next(Object.assign({}, comment, { replies: r }))))

const addReplies = (videoId, comment) =>
  (comment.hasReplies && !comment.replies)
    ? Rx.Observable.defer(() => fetchCommentReplies(videoId, comment))
    : Rx.Observable.defer(() => Rx.Observable.of(comment))

module.exports = videoId =>
  buildCommentPageStream(videoId)
    .concatMap(html => Rx.Observable.from(tokenizeComments(html)))
    .map($commentThread =>
      parseCommentThread($commentThread)
        .fold(e => { throw new Error(e) },
              c => c))
    .map(c => addReplies(videoId, c))
    .concatAll()

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
