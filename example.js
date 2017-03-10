const Task = require('data.task')
const fetchComments = require('./index')

const fetchAllComments = (videoId, pageToken, fetched = []) =>
  fetchComments(videoId, pageToken)
    .chain(({ comments, nextPageToken }) =>
      nextPageToken
        ? fetchAllComments(videoId, nextPageToken, fetched.concat(comments))
        : Task.of(fetched.concat(comments)))

fetchAllComments('OkcP5Od86r0')
  .fork(e => console.error('ERROR', e),
        allComments => console.log(allComments))
