const { expect } = require('chai')
const td = require('testdouble')
const Either = require('data.either')
const Task = require('data.task')

describe('/lib/comment-stream', () => {
  afterEach(() => {
    td.reset()
  })

  it('rexports a function', () => {
    const fetchComments = require('../../lib/fetch-comments')
    expect(fetchComments).to.be.a('function')
  })

  it('fetches a single comment page', () => {
    const videoId = 'videoId'
    const commentPage = '<div>page1</div>'
    const commentPageTokens = ['token1', 'token2', 'token3']
    const comments = [
      {id: 'c1', hasReplies: false},
      {id: 'c2', hasReplies: true, numReplies: 3},
      {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']}
    ]
    const c2Replies = ['c2r1', 'c2r2', 'c2r3']

    const fetchCommentPage = td.replace('../../lib/fetch-comment-page')
    const tokenizeComments = td.replace('../../lib/tokenize-comments')
    const parseCommentThread = td.replace('../../lib/parse-comment-thread')
    const fetchReplies = td.replace('../../lib/fetch-replies')
    const fetchComments = require('../../lib/fetch-comments')

    td.when(fethComme(videoId))
      .thenReturn(Observable.of(commentPage))

    td.when(tokenizeComments(commentPage))
      .thenReturn(commentPageTokens)

    comments.forEach((c, i) => {
      td.when(parseCommentThread(commentPageTokens[i]))
        .thenReturn(Either.of(c))
    })

    td.when(fetchReplies(videoId, comments[1]))
      .thenReturn(Task.of(c2Replies))

    const results = []
    buildCommentStream(videoId)
      .subscribe({
        next: c => results.push(c),
        error: e => {
          done('Got error: ' + e)
        },
        complete: () => {
          expect(results).to.be.a('array').of.length(3)
          expect(results[0]).to.deep.equal(comments[0])
          expect(results[1]).to.deep.equal(Object.assign({}, comments[1], {replies: c2Replies}))
          expect(results[2]).to.deep.equal(comments[2])
          done()
        }
      })
  })

  // it('returns an observable', () => {
  //   const videoId = 'videoId'
  //
  //   const buildCommentPageStream = td.replace('../../lib/comment-page-stream')
  //   const buildCommentStream = require('../../lib/comment-stream')
  //
  //   td.when(buildCommentPageStream(videoId))
  //     .thenReturn(Observable.empty())
  //
  //   const comments$ = buildCommentStream(videoId)
  //   expect(comments$).to.be.instanceof(Observable)
  // })
  //
  // it('streams comments on one page', done => {
    // const videoId = 'videoId'
    // const commentPage = '<div>page1</div>'
    // const commentPageTokens = ['token1', 'token2', 'token3']
    // const comments = [
    //   {id: 'c1', hasReplies: false},
    //   {id: 'c2', hasReplies: true, numReplies: 3},
    //   {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']}
    // ]
    // const c2Replies = ['c2r1', 'c2r2', 'c2r3']
    //
    // const buildCommentPageStream = td.replace('../../lib/comment-page-stream')
    // const tokenizeComments = td.replace('../../lib/tokenize-comments')
    // const parseCommentThread = td.replace('../../lib/parse-comment-thread')
    // const fetchReplies = td.replace('../../lib/fetch-replies')
    // const buildCommentStream = require('../../lib/comment-stream')
    //
    // td.when(buildCommentPageStream(videoId))
    //   .thenReturn(Observable.of(commentPage))
    //
    // td.when(tokenizeComments(commentPage))
    //   .thenReturn(commentPageTokens)
    //
    // comments.forEach((c, i) => {
    //   td.when(parseCommentThread(commentPageTokens[i]))
    //     .thenReturn(Either.of(c))
    // })
    //
    // td.when(fetchReplies(videoId, comments[1]))
    //   .thenReturn(Task.of(c2Replies))
    //
    // const results = []
    // buildCommentStream(videoId)
    //   .subscribe({
    //     next: c => results.push(c),
    //     error: e => {
    //       done('Got error: ' + e)
    //     },
    //     complete: () => {
    //       expect(results).to.be.a('array').of.length(3)
    //       expect(results[0]).to.deep.equal(comments[0])
    //       expect(results[1]).to.deep.equal(Object.assign({}, comments[1], {replies: c2Replies}))
    //       expect(results[2]).to.deep.equal(comments[2])
    //       done()
    //     }
    //   })
  // })
  //
  // it('streams comments on multiple pages', done => {
  //   const videoId = 'videoId'
  //   const commentPages = [
  //     '<div>page1</div>',
  //     '<div>page2</div>'
  //   ]
  //   const pageTokens = ['token1', 'token2', 'token3', 'token4', 'token5']
  //   const comments = [
  //     {id: 'c1', hasReplies: false},
  //     {id: 'c2', hasReplies: true, numReplies: 3},
  //     {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']},
  //     {id: 'c4', hasReplies: false},
  //     {id: 'c5', hasReplies: true, numReplies: 2}
  //   ]
  //   const c2Replies = ['c2r1', 'c2r2', 'c2r3']
  //   const c5Replies = ['c5r1', 'c5r2']
  //
  //   const buildCommentPageStream = td.replace('../../lib/comment-page-stream')
  //   const tokenizeComments = td.replace('../../lib/tokenize-comments')
  //   const parseCommentThread = td.replace('../../lib/parse-comment-thread')
  //   const fetchReplies = td.replace('../../lib/fetch-replies')
  //   const buildCommentStream = require('../../lib/comment-stream')
  //
  //   td.when(buildCommentPageStream(videoId))
  //     .thenReturn(Observable.from(commentPages))
  //
  //   td.when(tokenizeComments(commentPages[0]))
  //     .thenReturn(pageTokens.slice(0, 3))
  //
  //   td.when(tokenizeComments(commentPages[1]))
  //     .thenReturn(pageTokens.slice(3))
  //
  //   comments.forEach((c, i) => {
  //     td.when(parseCommentThread(pageTokens[i]))
  //       .thenReturn(Either.of(c))
  //   })
  //
  //   td.when(fetchReplies(videoId, comments[1]))
  //     .thenReturn(Task.of(c2Replies))
  //
  //   td.when(fetchReplies(videoId, comments[4]))
  //     .thenReturn(Task.of(c5Replies))
  //
  //   const results = []
  //   buildCommentStream(videoId)
  //     .subscribe({
  //       next: c => results.push(c),
  //       error: e => done('Got an error ' + e),
  //       complete: () => {
  //         expect(results).to.be.an('array').of.length(5)
  //         expect(results[0]).to.deep.equal(comments[0])
  //         expect(results[1]).to.deep.equal(Object.assign({}, comments[1], {replies: c2Replies}))
  //         expect(results[2]).to.deep.equal(comments[2])
  //         expect(results[3]).to.deep.equal(comments[3])
  //         expect(results[4]).to.deep.equal(Object.assign({}, comments[4], {replies: c5Replies}))
  //         done()
  //       }
  //     })
  // })
})
