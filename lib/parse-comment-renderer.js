const moment = require('moment')
const Either = require('data.either')
const { liftMN } = require('control.monads')

const { strTrim, strToInt, regExec } = require('./utils/string-utils')
const {
  cheerioAttr,
  cheerioFindText,
  cheerioFindAttr
} = require('./utils/cheerio-utils')

const extractLikes = $c =>
  cheerioFindText($c, '.comment-action-buttons-toolbar > .comment-renderer-like-count.on')
    .chain(strToInt)
    .map(l => l - 1)

const parseFromNow = fromNow =>
  regExec(/(\d+)\s(\w+)\sago$/, fromNow)
    .map(([_, n, u]) => moment().subtract(n, u).valueOf())

const addTimestamp = comment =>
  parseFromNow(comment.time)
    .map(timestamp => Object.assign({}, comment, { timestamp }))

const buildComment = (id, author, authorLink, authorThumb, text, likes, time) =>
    Object.assign({}, { id, author, authorLink, authorThumb, text, likes, time })

const parseCommentRenderer = $commentRenderer =>
  Either.fromNullable($commentRenderer)
    .leftMap(_ => '$commentRenderer parameter must be defined')
    .chain($c => liftMN(buildComment, [
      cheerioAttr($c, 'data-cid').map(strTrim),
      cheerioFindText($c, '.comment-renderer-header > .comment-author-text').map(strTrim),
      cheerioFindAttr($c, '.comment-renderer-header > a.comment-author-text', 'href').map(strTrim),
      cheerioFindAttr($c, '.comment-author-thumbnail img', 'src').map(strTrim),
      cheerioFindText($c, '.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').map(strTrim),
      extractLikes($c),
      cheerioFindText($c, '.comment-renderer-header > .comment-renderer-time').map(strTrim)
    ]))
    .chain(addTimestamp)

module.exports = parseCommentRenderer
