const Either = require('data.either')
const { List } = require('immutable-ext')

const parseCommentRenderer = require('./parse-comment-renderer')

const {
  cheerioFindAll
} = require('./utils/cheerio-utils')

const parseRepliesRenderer = $repliesRenderer =>
  cheerioFindAll($repliesRenderer, '.comment-replies-renderer > .comment-renderer')
    .chain($commentRenderers =>
      List($commentRenderers).traverse(Either.of, parseCommentRenderer))
    .map(l => l.toJS())

module.exports = parseRepliesRenderer
