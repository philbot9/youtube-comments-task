const defaultConfig = require('./default-config')
const fetchComments = require('./lib/fetch-comments')

module.exports = (videoId, config) =>
  fetchComments(videoId, Object.assign({}, defaultConfig, config))
