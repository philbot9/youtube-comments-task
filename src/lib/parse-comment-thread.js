const Either = require('data.either')
const { liftM2 } = require('control.monads')

/*
 * TODO: Add config value to disable replies
 */

const parseCommentRenderer = require('./parse-comment-renderer')
const parseReplies = require('./parse-replies')
const { cheerioFind, cheerioAttr } = require('./utils/cheerio-utils')
const { regExec, regMatch, strToInt, strTrim } = require('./utils/string-utils')

const getCommentRenderer = $commentThread => cheerioFind($commentThread, '.comment-thread-renderer > .comment-renderer:nth-child(1)')

const getRepliesRenderer = $commentThread => cheerioFind($commentThread, '.comment-replies-renderer')

const hasReplies = $commentThread => cheerioFind($commentThread, '.comment-replies-renderer > div')
  .fold(_ => false, _ => true)

const areRepliesCollapsed = $repliesContainer => cheerioFind($repliesContainer, '.yt-uix-expander-collapsed')
  .fold(_ => false, _ => true)

const extractRepliesToken = $repliesRenderer => cheerioFind($repliesRenderer, '.load-more-button')
  .chain($e => cheerioAttr($e, 'data-uix-load-more-post-body'))
  .map(strTrim)
  .map(t => t.replace(/^page_token=/i, ''))
  .map(t => decodeURIComponent(t))

const addRepliesInfo = (comment, $repliesRenderer) => extractRepliesToken($repliesRenderer)
  .map(repliesToken => ({ hasReplies: true, repliesToken}))
  .map(r => Object.assign({}, comment, r))

const parseCommentReplies = (comment, $repliesRenderer) => parseReplies($repliesRenderer)
  .map(replies => Object.assign({}, comment, {
    hasReplies: true,
    numReplies: replies.length,
  replies}))

const addReplies = (comment, $commentThread) => getRepliesRenderer($commentThread)
  .chain($repliesRenderer => areRepliesCollapsed($repliesRenderer)
    // if collapsed, extract replies info so we can fetch them later
    ? addRepliesInfo(comment, $repliesRenderer)
    // if not collapsed, parse the replies
    : parseCommentReplies(comment, $repliesRenderer))

const parseCommentThread = $commentThread => Either.fromNullable($commentThread)
  .leftMap(_ => '$commentThread parameter must be defined')
  .chain(getCommentRenderer)
  .chain(parseCommentRenderer)
  .chain(c => hasReplies($commentThread)
    ? addReplies(c, $commentThread)
    : Either.of(Object.assign({}, c, {hasReplies: false})))

module.exports = parseCommentThread
