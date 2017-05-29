const Either = require('data.either')
const debug = require('debug')('error-handler')

const { cheerioLoad, cheerioFindText } = require('./utils/cheerio-utils')
const { strTrim } = require('./utils/string-utils')
const errorTypes = require('./error-types')

const logUnknownError = data => {
  const { component, operation, videoId, html } = data
  debug(
    [
      'Unknown error - ',
      videoId ? `[ ${videoId} ] ` : null,
      component ? `${component}:` : null,
      operation ? `${operation} ` : null,
      html
    ]
      .filter(Boolean)
      .join('')
  )

  return data
}

const buildDefaultError = ({ component, operation, videoId }) => ({
  component,
  operation,
  videoId
})

const errorTypeMatchers = [
  {
    reg: /available in your country/i,
    type: errorTypes.VIDEO_ERROR_COUNTRY_RESTRICTION
  },
  { reg: /no longer available/i, type: errorTypes.VIDEO_ERROR_UNAVAILABLE },
  { reg: /private/i, type: errorTypes.VIDEO_ERROR_PRIVATE }
]

const applyErrorTypeMatcher = (type, matcher, message) =>
  matcher.reg.test(message) ? matcher.type : type

const extractErrorType = (message, defaultType) =>
  errorTypeMatchers.reduce(
    (type, matcher) => applyErrorTypeMatcher(type, matcher, message),
    defaultType
  )

const buildVideoPageError = ({ message, component, operation, videoId }) =>
  Object.assign(buildDefaultError({ component, operation, videoId }), {
    message,
    type: extractErrorType(message, errorTypes.VIDEO_ERROR)
  })

const videoPageError = ({ component, operation, videoId, html }) =>
  cheerioLoad(html)
    .chain($p => cheerioFindText($p, '#player-unavailable h1'))
    .leftMap(_ => logUnknownError({ component, operation, videoId, html }))
    .leftMap(_ => Either.of('unknown error'))
    .map(Either.of)
    .merge()
    .map(strTrim)
    .map(m => m.replace(/[\n\t]+/g, ' '))
    .map(message =>
      buildVideoPageError({ message, component, operation, videoId })
    )
    .merge()

const noCommentsError = ({ component, operation, videoId }) =>
  Object.assign(buildDefaultError({ component, operation, videoId }), {
    message: 'The video does not have any comments.',
    type: errorTypes.VIDEO_ERROR_NO_COMMENTS
  })

const scraperError = ({ component, operation, videoId, message }) =>
  Object.assign(buildDefaultError({ component, operation, videoId }), {
    type: errorTypes.SCRAPER_ERROR,
    message
  })

module.exports = { videoPageError, noCommentsError, scraperError }
