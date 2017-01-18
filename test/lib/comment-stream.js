const test = require('tape')
const td = require('testdouble')
const { Observable } = require('rxjs')
const Either = require('data.either')
const Task = require('data.task')

test('/lib/comment-stream', t => {
  t.test('- returns an observable', t => {
    const videoId = 'videoId'

    const buildCommentPageStream = td.replace('../../lib/comment-page-stream')
    const buildCommentStream = require('../../lib/comment-stream')

    td.when(buildCommentPageStream(videoId))
      .thenReturn(Observable.empty())

    const comments$ = buildCommentStream(videoId)
    t.ok(comments$)
    t.ok(comments$ instanceof Observable, 'is instance of observable')

    td.reset()
    t.end()
  })

  t.test('- streams comments on one page', t => {
    const videoId = 'videoId'
    const commentPage = '<div>page1</div>'
    const commentPageTokens = ['token1', 'token2', 'token3']
    const comments = [
      {id: 'c1', hasReplies: false},
      {id: 'c2', hasReplies: true, numReplies: 3},
      {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']}
    ]
    const c2Replies = ['c2r1', 'c2r2', 'c2r3']

    const buildCommentPageStream = td.replace('../../lib/comment-page-stream')
    const tokenizeComments = td.replace('../../lib/tokenize-comments')
    const parseCommentThread = td.replace('../../lib/parse-comment-thread')
    const fetchReplies = td.replace('../../lib/fetch-replies')
    const buildCommentStream = require('../../lib/comment-stream')

    td.when(buildCommentPageStream(videoId))
      .thenReturn(Observable.of(commentPage))

    td.when(tokenizeComments(commentPage))
      .thenReturn(commentPageTokens)

    comments.forEach((c, i) => {
      td.when(parseCommentThread(commentPageTokens[i]))
        .thenReturn(Either.of(c))
    })

    td.when(fetchReplies(videoId, comments[1]))
      .thenReturn(Task.of(c2Replies))

    t.plan(4)

    const results = []
    buildCommentStream(videoId)
      .subscribe({
        next: c => results.push(c),
        error: e => {
          t.fail(e)
          t.end()
        },
        complete: () => {
          t.equal(results.length, 3, 'correct number of comments')
          t.deepEqual(results[0], comments[0])
          t.deepEqual(results[1], Object.assign({}, comments[1], {replies: c2Replies}))
          t.deepEqual(results[2], comments[2])
          td.reset()
          t.end()
        }
      })
  })

  t.test('- streams comments on multiple pages', t => {
    const videoId = 'videoId'
    const commentPages = [
      '<div>page1</div>',
      '<div>page2</div>'
    ]
    const pageTokens = ['token1', 'token2', 'token3', 'token4', 'token5']
    const comments = [
      {id: 'c1', hasReplies: false},
      {id: 'c2', hasReplies: true, numReplies: 3},
      {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']},
      {id: 'c4', hasReplies: false},
      {id: 'c5', hasReplies: true, numReplies: 2}
    ]
    const c2Replies = ['c2r1', 'c2r2', 'c2r3']
    const c5Replies = ['c5r1', 'c5r2']

    const buildCommentPageStream = td.replace('../../lib/comment-page-stream')
    const tokenizeComments = td.replace('../../lib/tokenize-comments')
    const parseCommentThread = td.replace('../../lib/parse-comment-thread')
    const fetchReplies = td.replace('../../lib/fetch-replies')
    const buildCommentStream = require('../../lib/comment-stream')

    td.when(buildCommentPageStream(videoId))
      .thenReturn(Observable.from(commentPages))

    td.when(tokenizeComments(commentPages[0]))
      .thenReturn(pageTokens.slice(0, 3))

    td.when(tokenizeComments(commentPages[1]))
      .thenReturn(pageTokens.slice(3))

    comments.forEach((c, i) => {
      td.when(parseCommentThread(pageTokens[i]))
        .thenReturn(Either.of(c))
    })

    td.when(fetchReplies(videoId, comments[1]))
      .thenReturn(Task.of(c2Replies))

    td.when(fetchReplies(videoId, comments[4]))
      .thenReturn(Task.of(c5Replies))

    t.plan(6)

    const results = []
    buildCommentStream(videoId)
      .subscribe({
        next: c => results.push(c),
        error: e => {
          t.fail(e)
          t.end()
        },
        complete: () => {
          t.equal(results.length, 5, 'correct number of comments')
          t.deepEqual(results[0], comments[0])
          t.deepEqual(results[1], Object.assign({}, comments[1], {replies: c2Replies}))
          t.deepEqual(results[2], comments[2])
          t.deepEqual(results[3], comments[3])
          t.deepEqual(results[4], Object.assign({}, comments[4], {replies: c5Replies}))
          td.reset()
          t.end()
        }
      })
  })
})
