const test = require('tape')
const cheerio = require('cheerio')

const buildCommentStream = require('../../lib/comment-stream')

test('/lib/comment-stream', t => {
  t.test('- fetches comments', t => {
    const results = []
    buildCommentStream('9bZkp7q19f0')
      .take(100)
      .subscribe({
        next: p => results.push(p),
        error: e => {
          t.fail(e)
          t.end()
        },
        complete: () => {
          t.equal(results.length, 100)
          results.forEach(c => {
            t.ok(c.id, 'comment has an id')
            t.ok(c.author, 'comment has an author')
            t.ok(c.authorLink, 'comment has an author link')
            t.ok(c.authorThumb, 'comment has an author thumb')
            t.ok(c.text, 'comment has text')
            t.equal(typeof c.likes, 'number', 'comment has a likes count')
            t.ok(c.likes >= 0, 'likes is 0 or a positive number')
            t.ok(c.time, 'comment has a time')
            t.equal(typeof c.timestamp, 'number', 'comment has a timestamp')
            t.ok(c.timestamp > 0, 'timestamp is greater than 0')
            t.equal(typeof c.hasReplies, 'boolean', 'comment has hasReplies field')

            if (c.hasReplies) {
              t.ok(c.replies, 'comment has replies'),
              t.equal(c.repliesCount, 'number', 'comment has repliesCount')
              t.equal(c.replies.length, c.numReplies, 'numReplies is correct')
            }
          })
          t.end()
        }
      })
  })
})
