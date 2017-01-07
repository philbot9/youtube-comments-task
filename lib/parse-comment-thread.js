const moment = require('moment')
const Either = require('data.either')
const { liftMN } = require('control.monads')

/*
 * TODO: Add config value to disable replies
 */

const parseCommentRenderer = require('./parse-comment-renderer')
const {
  cheerioFind
} = require('./utils/cheerio-utils')

const getCommentRenderer = $commentThread =>
  cheerioFind($commentThread, '.comment-thread-renderer > .comment-renderer:nth-child(1)')

const getRepliesContainer = $commentThread =>
  cheerioFind($commentThread, '.comment-replies-renderer > div')

const buildRepliesInfo = (numReplies, repliesToken) =>
({
  hasReplies: numReplies > 0,
  numReplies,
  repliesToken
})

// const extractNumReplies = $replies =>
//   cheerioFind($replies, 'div > button:nth-of-type(1) .load-more-text')
//     .map($e => $e.text())
//     .map(t => t.trim())
//     .chain(t => regExec(t, /^View (?:all\s)?(\d+)/i))
//     .chain(([c]) => strToInt(c))
//
// const numReplies = m && m[1] ? parseInt(m[1], 10) : 1
//
// const extractRepliesInfo = $commentThread =>
//   getRepliesContainer($commentThread)
//     .map($replies =>
//       buildRepliesInfo(extractNumReplies($replies), extractRepliesToken($replies)))

const addRepliesInfo = (comment, $commentThread) =>
  Either.of(Object.assign({}, comment, {hasReplies: false}))

const parseCommentThread = $commentThread =>
  Either.fromNullable($commentThread)
    .leftMap(_ => '$commentThread parameter must be defined')
    .chain(getCommentRenderer)
    .chain(parseCommentRenderer)
    .chain(c => addRepliesInfo(c, $commentThread))

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
