module.exports = (session, pageToken) => {
  if (!session) {
    throw new Error('Missing first parameter: session')
  }

  const { sessionToken } = session
  if (!sessionToken) {
    throw new Error('Missing field in session: session.sessionToken')
  }

  const form = { session_token: sessionToken }
  if (pageToken) {
    form.page_token = pageToken
  }

  return form
}
