const defaultConfig = require('./default-config')
const buildCommentStream = require('./lib/comment-stream')

module.exports = (videoId, config) => buildCommentStream(videoId, Object.assign({}, defaultConfig, config))
