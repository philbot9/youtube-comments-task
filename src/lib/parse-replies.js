const Either = require('data.either')
const { List } = require('immutable-ext')

const parseCommentRenderer = require('./parse-comment-renderer')

const { cheerioFindAll } = require('./utils/cheerio-utils')

const parseReplies = $replies =>
  cheerioFindAll($replies, '.comment-renderer')
    .chain($commentRenderers =>
      List($commentRenderers).traverse(Either.of, parseCommentRenderer))
    .map(l => l.toJS())

module.exports = parseReplies
