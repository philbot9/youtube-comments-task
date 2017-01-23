// const Task = require('data.task')
//
// const handleRes = res =>
//   res.map(({ comments, next }) => {
//     console.log('emitting', comments.length)
//     return { comments, next }
//   })
//   .chain(({ next }) =>
//     next ? handleRes(next()) : Task.of('done'))
//
// fetchComments('sRBsJNdK1t0')
//   .chain(handleRes)
//   .fork(e => console.error(e),
//         r => console.log('DONE', r))
//
//

const fetchComments = require('./index')
const Task = require('data.task')

let totalComments = 0
let totalFetches = 0

const fetchAll = (videoId, pageToken) =>
  fetchComments(videoId, pageToken)
    .map(c => {
      totalComments += c.comments.length
      console.log(totalComments, ++totalFetches)
      c.comments.some(c => {
        if (c.hasReplies) {
          console.log('NUM_REPLIES', c.numReplies)
          c.replies.forEach(r => console.log('REPLY', r))
          console.log('\n\n')
        }
        return c.hasReplies
      })
      return c
    })
    .chain(({ nextPageToken }) =>
      nextPageToken ? fetchAll(videoId, nextPageToken) : Task.of('done!'))

fetchAll('sRBsJNdK1t0')
  .fork(e => console.error(e),
        c => console.log('COMPLETE', c, totalComments))
