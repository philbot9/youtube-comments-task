const moment = require('moment')
const Either = require('data.either')
const { pickBy } = require('ramda')

const { strTrim, strToInt, regExec } = require('./utils/string-utils')
const {
  cheerioAttr,
  cheerioFindText,
  cheerioFindAttr
} = require('./utils/cheerio-utils')

const resolveAny = (e, def) =>
  e.fold(_ => def, x => x)

const compact = pickBy(v => v != null && v !== '')

const extractLikes = $c =>
  cheerioFindText($c, '.comment-action-buttons-toolbar > .comment-renderer-like-count.on')
    .chain(strToInt)
    .map(l => l - 1)

const parseFromNow = fromNow =>
  regExec(/(\d+)\s(\w+)\sago/, fromNow)
    .map(([_, n, u]) => moment().subtract(n, u).valueOf())

const commentEdited = $c =>
  cheerioFindText($c, '.comment-renderer-header > .comment-renderer-time')
    .map(t => /\(edited\)/i.test(t))

const extractTime = $c =>
  cheerioFindText($c, '.comment-renderer-header > .comment-renderer-time')
    .map(t => t.replace(/\s*\(edited\)/i, ''))
    .map(strTrim)

const addTimestamp = comment =>
  Either.fromNullable(comment.time)
    .chain(parseFromNow)
    .map(timestamp => Object.assign({}, comment, { timestamp }))

const extractFields = $c => ({
  id: resolveAny(cheerioAttr($c, 'data-cid').map(strTrim)),
  author: resolveAny(cheerioFindText($c, '.comment-author-text').map(strTrim)),
  authorLink: resolveAny(cheerioFindAttr($c, 'a.comment-author-text', 'href').map(strTrim)),
  authorThumb: resolveAny(cheerioFindAttr($c, '.comment-author-thumbnail img', 'src').map(strTrim)),
  text: resolveAny(cheerioFindText($c, '.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').map(strTrim)),
  likes: resolveAny(extractLikes($c)),
  time: resolveAny(extractTime($c)),
  edited: resolveAny(commentEdited($c))
})

const parseCommentRenderer = $commentRenderer =>
  Either.fromNullable($commentRenderer)
    .leftMap(_ => '$commentRenderer parameter must be defined')
    .map(extractFields)
    .map(compact)
    .map(c => resolveAny(addTimestamp(c), c))

module.exports = parseCommentRenderer
