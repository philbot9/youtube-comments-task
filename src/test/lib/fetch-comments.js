const { expect } = require('chai')
const td = require('testdouble')
const Either = require('data.either')
const { List } = require('immutable-ext')
const Task = require('data.task')

describe('/lib/comment-stream', () => {
  afterEach(() => {
    td.reset()
  })

  it('rexports a function', () => {
    const fetchComments = require('../../lib/fetch-comments')
    expect(fetchComments).to.be.a('function')
  })

  it('fetches a single first page (no pageToken provided)', done => {
    const videoId = 'videoId'
    const commentHtml = '<div>page1</div>'
    const commentPage = { commentHtml }
    const pageToken = 'token1'
    const commentPageTokens = List.of('ct1', 'ct2', 'ct3')
    const comments = [
      {id: 'c1', hasReplies: false},
      {id: 'c2', hasReplies: true, numReplies: 3},
      {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']}
    ]
    const c2Replies = ['c2r1', 'c2r2', 'c2r3']

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const fetchCommentPage = td.replace('../../lib/fetch-comment-page')
    const tokenizeComments = td.replace('../../lib/tokenize-comments')
    const parseCommentThread = td.replace('../../lib/parse-comment-thread')
    const fetchReplies = td.replace('../../lib/fetch-replies')
    const fetchComments = require('../../lib/fetch-comments')

    td.when(fetchFirstPageToken(videoId))
      .thenReturn(Task.of(pageToken))

    td.when(fetchCommentPage(videoId, pageToken))
      .thenReturn(Task.of(commentPage))

    td.when(tokenizeComments(commentHtml))
      .thenReturn(Either.of(commentPageTokens))

    comments.forEach((c, i) => {
      td.when(parseCommentThread(commentPageTokens.get(i)))
        .thenReturn(Either.of(c))
    })

    td.when(fetchReplies(videoId, comments[1]))
      .thenReturn(Task.of(c2Replies))

    fetchComments(videoId)
      .fork(e => done('Got an error: ' + e),
      res => {
        expect(res).to.have.property('comments')
        expect(res).not.to.have.property('nextPageToken')

        expect(res.comments).to.be.an('array').of.length(3)
        expect(res.comments[0]).to.deep.equal(comments[0])
        expect(res.comments[1]).to.deep.equal(Object.assign({}, comments[1], {replies: c2Replies}))
        expect(res.comments[2]).to.deep.equal(comments[2])
        done()
      })
  })

  it('fetches a page when given a pageToken', done => {
    const videoId = 'videoId'
    const commentHtml = '<div>page1</div>'
    const commentPage = { commentHtml }
    const pageToken = 'token1'
    const commentPageTokens = List.of('ct1', 'ct2', 'ct3')
    const comments = [
      {id: 'c1', hasReplies: false},
      {id: 'c2', hasReplies: true, numReplies: 3},
      {id: 'c3', hasReplies: true, numReplies: 2, replies: ['c3r1', 'c3r2']}
    ]
    const c2Replies = ['c2r1', 'c2r2', 'c2r3']

    const fetchFirstPageToken = td.replace('../../lib/fetch-first-page-token')
    const fetchCommentPage = td.replace('../../lib/fetch-comment-page')
    const tokenizeComments = td.replace('../../lib/tokenize-comments')
    const parseCommentThread = td.replace('../../lib/parse-comment-thread')
    const fetchReplies = td.replace('../../lib/fetch-replies')
    const fetchComments = require('../../lib/fetch-comments')

    td.when(fetchFirstPageToken(videoId))
      .thenDo(() => {
        done('fetchFirstPageToken should not be called')
        return Task.rejected('should not be called')
      })

    td.when(fetchCommentPage(videoId, pageToken))
      .thenReturn(Task.of(commentPage))

    td.when(tokenizeComments(commentHtml))
      .thenReturn(Either.of(commentPageTokens))

    comments.forEach((c, i) => {
      td.when(parseCommentThread(commentPageTokens.get(i)))
        .thenReturn(Either.of(c))
    })

    td.when(fetchReplies(videoId, comments[1]))
      .thenReturn(Task.of(c2Replies))

    fetchComments(videoId, pageToken)
      .fork(e => done('Got an error: ' + e),
      res => {
        expect(res).to.have.property('comments')
        expect(res).not.to.have.property('nextPageToken')

        expect(res.comments).to.be.an('array').of.length(3)
        expect(res.comments[0]).to.deep.equal(comments[0])
        expect(res.comments[1]).to.deep.equal(Object.assign({}, comments[1], {replies: c2Replies}))
        expect(res.comments[2]).to.deep.equal(comments[2])
        done()
      })
  })
})
