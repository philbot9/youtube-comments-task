const moment = require('moment')
const Either = require('data.either')
const { liftMN } = require('control.monads')

const strTrim = str =>
  str.trim()

const strToInt = Either.try(s => parseInt(s, 10))

const cheerioAttr = ($e, attr) =>
  Either.fromNullable($e.attr(attr))
    .leftMap(`Attribute ${attr} not found on ${$e}`)

const cheerioFind = ($e, sel) =>
  $e.find(sel).length > 0
    ? Either.Right($e.find(sel))
    : Either.of(`No matches for ${sel}`)

const cheerioFindText = ($e, sel) =>
  cheerioFind($e, sel)
    .map(r => r.text())

const cheerioFindAttr = ($e, sel, attr) =>
  cheerioFind($e, sel)
    .chain($r => cheerioAttr($r, attr))

const getCommentRenderer = $commentThread =>
  cheerioFind($commentThread, '.comment-thread-renderer > .comment-renderer')

const getRepliesContainer = $commentThread =>
  cheerioFind($commentThread, '.comment-replies-renderer > div')

const buildRepliesInfo = (numReplies, repliesToken) =>
({
  hasReplies: numReplies > 0,
  numReplies,
  repliesToken
})

const regExec = (regex, str) =>
  Either.fromNullable(regex.exec(str))
    .leftMap(_ => `${str} does not contain a match for ${regex.toString}`)

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

const extractLikes = $c =>
  cheerioFindText($c, '.comment-action-buttons-toolbar > .comment-renderer-like-count.on')
    .chain(strToInt)
    .map(l => l - 1)

const buildComment = (id, author, authorLink, authorThumb, text, likes, time) =>
    Object.assign({}, { id, author, authorLink, authorThumb, text, likes, time })

const parseFromNow = fromNow =>
  regExec(/(\d+)\s(\w+)\sago$/, fromNow)
    .map(([_, n, u]) => moment().subtract(n, u).valueOf())

const addTimestamp = comment =>
  parseFromNow(comment.time)
    .map(timestamp => Object.assign({}, comment, { timestamp }))

const addRepliesInfo = (comment, $commentThread) =>
  Either.of(Object.assign({}, comment, {hasReplies: false}))

module.exports = $commentThread =>
  Either.fromNullable($commentThread)
    .leftMap(_ => '$commentThread parameter must be defined')
    .chain(getCommentRenderer)
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
    .chain(c => addRepliesInfo(c, $commentThread))
    // TODO: If the replies aren't collapsed, we might as well parse them here
    //       instead of having to fetch them later

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
