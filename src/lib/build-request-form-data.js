export default function (session, pageToken) {
  if (!session) {
    throw new Error('Missing first parameter: session')
  }
  if (!pageToken) {
    throw new Error('Missing second parameter: pageToken')
  }

  const { sessionToken } = session
  if (!sessionToken) {
    throw new Error('Missing field in session: session.sessionToken')
  }

  return {
    session_token: sessionToken,
    page_token: pageToken
  }
}
