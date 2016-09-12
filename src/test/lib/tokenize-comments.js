import test from 'blue-tape'
import cheerio from 'cheerio'

import tokenizeComments from '../../lib/tokenize-comments'

test('/lib/split-comments.js', t => {
  t.test('exports a function', t => {
    t.equal(typeof tokenizeComments, 'function', 'is of type function')
    t.end()
  })

  t.test('throws an error if html argument is missing', t => {
    t.throws(() => tokenizeComments())
    t.throws(() => tokenizeComments(''))
    t.end()
  })

  t.test('returns an empty array if the html doesn\'t contain any comments', t => {
    const html = '<div><div class="no-comment">nope</div><div class="no-comment">hahaha</div></div>'
    const commentTokens = tokenizeComments(html)
    t.deepEqual(commentTokens, [])
    t.end()
  })

  t.test('returns an array of cheerio tokens', t => {
    const c1 = 'comment1'
    const r1 = 'reply1'
    const c2 = 'comment2'
    const html = [
      '<section class="comment-thread-renderer">',
      ' <div class="comment-renderer">' + c1 + '</div>',
      ' <div class="comment-replies-renderer">',
      '   <div class="comment-replies-renderer-header">',
      '     <div class="yt-uix-expander-collapsed-body">',
      '       <button class="comment-replies-renderer-paginator">',
      '       <div class="comment-renderer">' + r1 + '</div>',
      '     </div>',
      '   </div>',
      ' </div>',
      '</section>',
      '<section class="comment-thread-renderer">',
      ' <div class="comment-renderer">' + c2 + '</div>',
      ' <div class="comment-replies-renderer"></div>',
      '</section>'
    ].join('')

    const tokenizedComments = tokenizeComments(html)
    t.ok(tokenizedComments, 'return value exists')
    t.ok(Array.isArray(tokenizedComments), 'return value is an array')
    t.equal(tokenizedComments.length, 2, 'found the right number of comments')

    const $comment1 = cheerio(tokenizedComments[0])
    const $comment2 = cheerio(tokenizedComments[1])

    t.equal($comment1.find('.comment-thread-renderer > .comment-renderer').text(), c1, 'finds 1st comment')
    t.equal($comment1.find('.comment-replies-renderer .comment-renderer').text(), r1, 'finds 1st reply')
    t.equal($comment2.find('.comment-thread-renderer > .comment-renderer').text(), c2, 'finds 1st comment')

    t.end()
  })
})



// const html = [
//   '<section class="comment-thread-renderer">',
//   ' <div class="comment-renderer">',
//   '   <a class="yt-uix-sessionlink  g-hovercard"></a>',
//   '   <div class="comment-renderer-edit"></div>',
//   '   <div class="comment-renderer-content">',
//   '     <div class="comment-renderer-header">header1</div>',
//   '     <div class="comment-renderer-text">text1</div>',
//   '     <div class="comment-renderer-footer">footer1</div>',
//   '   </div>',
//   ' </div>',
//   ' <div class="comment-replies-renderer">',
//   '   <div class="comment-replies-renderer-header">',
//   '     <div class="yt-uix-expander-collapsed-body">',
//   '       <button class="comment-replies-renderer-paginator">',
//   '       <div class="comment-renderer">',
//   '         <a class="yt-uix-sessionlink  g-hovercard"></a>',
//   '         <div class="comment-renderer-edit"></div>',
//   '         <div class="comment-renderer-content">',
//   '           <div class="comment-renderer-header">reply header1</div>',
//   '           <div class="comment-renderer-text">reply text1</div>',
//   '           <div class="comment-renderer-footer">reply footer1</div>',
//   '         </div>',
//   '       </div>',
//   '     </div>',
//   '   </div>',
//   ' </div>',
//   '</section>'
// ]
