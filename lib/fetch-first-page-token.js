const Either = require('data.either')
const prop = require('propper')

const eitherToTask = require('./utils/either-to-task')
const { cheerioLoad, cheerioFind, cheerioAttr } = require('./utils/cheerio-utils')
const { commentsWatchFragment } = require('./youtube-api/youtube-api')

const getWatchDiscussion = res =>
  Either.fromNullable(prop(res, 'body.watch-discussion'))
    .leftMap(_ => 'Invalid API response. Missing field "watch-discussion"')

const extractButtonElement = html =>
  cheerioLoad(html)
    .chain($c => cheerioFind($c, '.comment-section-sort-menu li:nth-child(2) button.comment-section-sort-menu-item'))
    .leftMap(_ => `Cannot find "Newest First" button element in comment watch fragment:\n${html}`)

const extractDataToken = $btn =>
  cheerioAttr($btn, 'data-token')
    .leftMap(_ => '"Newst First" button is missing attribute "data-token"')

const extractToken = res =>
  getWatchDiscussion(res)
    .chain(extractButtonElement)
    .chain(extractDataToken)
    .map(decodeURIComponent)

const fetchFirstPageToken = videoId =>
  commentsWatchFragment(videoId)
    .map(extractToken)
    .chain(eitherToTask)

module.exports = fetchFirstPageToken
