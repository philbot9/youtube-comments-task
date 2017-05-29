const debug = require('debug')('fetch-first-page-token')
const Either = require('data.either')
const Task = require('data.task')
const prop = require('propper')

const eitherToTask = require('./utils/either-to-task')
const {
  cheerioLoad,
  cheerioFind,
  cheerioFindText,
  cheerioAttr
} = require('./utils/cheerio-utils')
const { regExec, strToInt } = require('./utils/string-utils')
const { commentsWatchFragment } = require('./youtube-api/youtube-api')
const { noCommentsError, scraperError } = require('./error-handler')

const getWatchDiscussion = res =>
  Either.fromNullable(prop(res, 'body.watch-discussion'))
    .leftMap(_ => 'Invalid API response. Missing field "watch-discussion"')
    .fold(Task.rejected, Task.of)

const extractButtonElement = $w =>
  cheerioFind(
    $w,
    '.comment-section-sort-menu li:nth-child(2) button.comment-section-sort-menu-item'
  ).leftMap(
    _ => `Cannot find "Newest First" button element in comment watch fragment:
${$w.html()}`
  )

const extractDataToken = $btn =>
  cheerioAttr($btn, 'data-token').leftMap(
    _ => '"Newest First" button is missing attribute "data-token"'
  )

const extractToken = $w =>
  extractButtonElement($w)
    .chain(extractDataToken)
    .map(decodeURIComponent)
    .fold(Task.rejected, Task.of)

const videoHasComments = $w =>
  cheerioFindText($w, '.comment-section-header-renderer')
    .map(t => t.replace(/,/g, ''))
    .chain(t => regExec(/comments\s*.\s*([\d,]+)/i, t))
    .map(m => m[1])
    .chain(strToInt)
    .map(c => c > 0)
    .leftMap(_ => false)
    .merge()

const buildNoCommentsError = videoId =>
  Task.rejected(
    noCommentsError({
      videoId,
      component: 'fetch-first-page-token',
      operation: 'extractToken'
    })
  )

const fetchFirstPageToken = videoId =>
  commentsWatchFragment(videoId)
    .chain(getWatchDiscussion)
    .map(cheerioLoad)
    .chain(eitherToTask)
    .chain(
      $w =>
        videoHasComments($w) ? extractToken($w) : buildNoCommentsError(videoId)
    )
    .rejectedMap(
      e =>
        e.type
          ? e
          : scraperError({
              videoId,
              message: e,
              component: 'fetch-first-page-token',
              operation: 'fetch-first-page-token'
            })
    )

module.exports = fetchFirstPageToken
