const { expect } = require('chai')
const cheerio = require('cheerio')

const tokenizeComments = require('../../lib/tokenize-comments')

describe('/lib/tokenize-comments.js', () => {
  it('- exports a function', () => {
    expect(tokenizeComments).to.be.a('function')
  })

  it("- returns an empty array if the html doesn't contain any comments", () => {
    const html = '<div><div class="no-comment">nope</div><div class="no-comment">hahaha</div></div>'
    const commentTokens = tokenizeComments(html)
    expect(commentTokens).to.be.a('array').of.length(0)
  })

  it('- returns an array of cheerio tokens', () => {
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
    expect(tokenizedComments).to.be.a('array').of.length(2)

    const $comment1 = cheerio(tokenizedComments[0])
    const $comment2 = cheerio(tokenizedComments[1])

    expect($comment1.find('.comment-thread-renderer > .comment-renderer').text()).to.equal(c1)
    expect($comment1.find('.comment-replies-renderer .comment-renderer').text()).to.equal(r1)
    expect($comment2.find('.comment-thread-renderer > .comment-renderer').text()).to.equal(c2)
  })
})
