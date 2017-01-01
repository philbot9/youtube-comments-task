const buildCommentStream = require('./index')

const comments = buildCommentStream('XkcGuZHPbKk')

const subscription = comments
  .subscribe({
    next: (c) => console.log('comment:', c),
    error: (err) => console.error('error', err),
    complete: () => console.log('complete')
  })
