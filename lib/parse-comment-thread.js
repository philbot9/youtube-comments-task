const moment = require('moment')
const Either = require('data.either')
const { liftM2 } = require('control.monads')

/*
 * TODO: Add config value to disable replies
 */

const parseCommentRenderer = require('./parse-comment-renderer')
const parseRepliesRenderer = require('./parse-replies-renderer')
const { cheerioFind, cheerioAttr } = require('./utils/cheerio-utils')
const { regExec, strToInt, strTrim } = require('./utils/string-utils')

const getCommentRenderer = $commentThread =>
  cheerioFind($commentThread, '.comment-thread-renderer > .comment-renderer:nth-child(1)')

const getRepliesRenderer = $commentThread =>
  cheerioFind($commentThread, '.comment-replies-renderer')

const hasReplies = $commentThread =>
  cheerioFind($commentThread, '.comment-replies-renderer > div')
    .fold(_ => false, _ => true)

const areRepliesCollapsed = $repliesContainer =>
  cheerioFind($repliesContainer, '.yt-uix-expander-collapsed')
    .fold(_ => false, _ => true)

const buildRepliesInfo = (numReplies, repliesToken) =>
({
  hasReplies: true,
  numReplies,
  repliesToken
})

const extractRepliesToken = $repliesRenderer =>
  cheerioFind($repliesRenderer, '.load-more-button')
    .chain($e => cheerioAttr($e, 'data-uix-load-more-post-body'))
    .map(strTrim)
    .map(t => t.replace(/^page_token=/i, ''))
    .map(t => decodeURIComponent(t))

const extractNumReplies = $repliesRenderer =>
  cheerioFind($repliesRenderer, '.load-more-button .load-more-text')
    .map($e => $e.text())
    .map(t => t.trim())
    .chain(t => regExec(/^View (?:all\s)?(\d+)/i, t))
    .chain(([_, c]) => strToInt(c))

const addRepliesInfo = (comment, $repliesRenderer) =>
  liftM2(buildRepliesInfo,
         extractNumReplies($repliesRenderer),
         extractRepliesToken($repliesRenderer))
    .map(r => Object.assign({}, comment, r))

const parseReplies = (comment, $repliesRenderer) =>
  parseRepliesRenderer($repliesRenderer)
    .map(replies => Object.assign({}, comment, {
      hasReplies: true,
      numReplies: replies.length,
      replies
    }))

const addReplies = (comment, $commentThread) =>
  getRepliesRenderer($commentThread)
    .chain($repliesRenderer =>
      areRepliesCollapsed($repliesRenderer)
        // if collapsed, extract replies info so we can fetch them later
        ? addRepliesInfo(comment, $repliesRenderer)
        // if not collapsed, parse the replies
        : parseReplies(comment, $repliesRenderer))

const parseCommentThread = $commentThread =>
  Either.fromNullable($commentThread)
    .leftMap(_ => '$commentThread parameter must be defined')
    .chain(getCommentRenderer)
    .chain(parseCommentRenderer)
    .chain(c =>
      hasReplies($commentThread)
        ? addReplies(c, $commentThread)
        : Either.of(Object.assign({}, c, {hasReplies: false})))

module.exports = parseCommentThread

// {
//   const $repliesContainer = $commentThread.find('.comment-replies-renderer > div')
//   const repliesInfo = extractRepliesInfo($repliesContainer)
//
//   const $comment = $commentThread.find('.comment-thread-renderer > .comment-renderer')
//   const likesStr = $commentThread.find('.comment-action-buttons-toolbar > .comment-renderer-like-count.on').text()
//   let likes = 0
//   if (likesStr) {
//     likes = parseInt(likesStr, 10) - 1
//   }
//
//   const fromNow = $comment.find('.comment-renderer-header > .comment-renderer-time').text().trim()
//   const timestamp = parseFromNow(fromNow)
//
//   return Object.assign({}, repliesInfo, {
//     id: $comment.attr('data-cid'),
//     user: $comment.find('.comment-renderer-header > .comment-author-text').text().trim(),
//     text: $comment.find('.comment-renderer-content > .comment-renderer-text > .comment-renderer-text-content').text().trim(),
//     fromNow,
//     timestamp,
//     likes
//   })
// }
//
// function extractRepliesInfo ($repliesContainer) {
//   if (!$repliesContainer.length) {
//     return {
//       hasReplies: false,
//       numReplies: 0
//     }
//   }
//
//   let repliesToken = $repliesContainer
//     .find('div > button:nth-of-type(1)')
//     .attr('data-uix-load-more-post-body')
//     .replace(/^page_token=/i, '')
//     .trim()
//   repliesToken = decodeURIComponent(repliesToken)
//
//   const btnText = $repliesContainer
  //   .find('div > button:nth-of-type(1) .load-more-text')
  //   .text()
  //   .trim()
  //
  // const m = btnText.match(/^View (?:all\s)?(\d+)/i)
  // const numReplies = m && m[1] ? parseInt(m[1], 10) : 1
//
//   return { hasReplies: true, repliesToken, numReplies}
// }
//
// function parseFromNow (fromNow) {
//   const m = /(\d+)\s(\w+)\sago$/.exec(fromNow)
//   if (!m || m.length !== 3) return undefined
//
//   return moment()
//     .subtract(m[1], m[2].replace(/s$/i, ''))
//     .valueOf()
// }
