import test from 'blue-tape'
import sinon from 'sinon'

import parseCommentPage from '../../lib/parse-comment-page'

test('/lib/parse-comment-page.js', t => {
  t.test('- exports a function', t => {
    t.equal(typeof parseCommentPage, 'function', 'is of type function')
    t.end()
  })
})
