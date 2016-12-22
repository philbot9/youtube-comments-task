export default function (dependencies) {
  if (!dependencies) {
    throw new Error('Missing parameter: dependencies')
  }

  const { request, getSession } = dependencies

  if (!request) {
    throw new Error('Missing dependency: request')
  }

  if (!getSession) {
    throw new Error('Missing dependency: getSession')
  }


  return (comment) => {
    if (!comment) {
      throw new Error('Missing first parameter: comment')
    }


  }
}

export function fetchReplies (repliesToken, { request, getSession }) {
  getSession()
}
