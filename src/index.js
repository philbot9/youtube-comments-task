import defaultConfig from './default-config'
import fetchComments from './lib/fetch-comments'

export default function (videoId, config) {
  return fetchComments(videoId, { ...defaultConfig, ...config })
}
