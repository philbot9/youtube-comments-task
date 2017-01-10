const Either = require('data.either')
const prop = require('propper')

const eitherToTask = require('./utils/either-to-task')

const cheerio = require('cheerio')
const { commentsWatchFragment } = require('./youtube-api/youtube-api')

const getWatchDiscussion = res =>
  Either.fromNullable(prop(res, 'body.watch-discussion'))
    .leftMap(_ => 'Invalid API response. Missing field "watch-discussion"')

const extractButtonElement = html =>
  Either.fromNullable(cheerio.load(html)('button[data-menu_name="newest-first"]'))
    .leftMap(_ => 'Cannot find button element in comment watch fragment')

const extractDataToken = $btn =>
  Either.fromNullable($btn.attr('data-token'))
    .leftMap(_ => 'Button is missing attribute "data-token"')

const extractToken = html =>
  extractButtonElement(html)
    .map(extractDataToken)
    .chain(eitherToTask)

const fetchFirstPageToken = videoId =>
  commentsWatchFragment(videoId)
    .map(res => {
      console.log(res)
      return res
    })
    .map(getWatchDiscussion)
    .chain(eitherToTask)
    .chain(extractToken)

module.exports = fetchFirstPageToken
