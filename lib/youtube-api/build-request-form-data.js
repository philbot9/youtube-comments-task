const Either = require('data.either')

module.exports = (session, pageToken) => {
  const { sessionToken } = session
  const form = { session_token: sessionToken }
  if (pageToken) {
    form.page_token = pageToken
  }

  return form
}
