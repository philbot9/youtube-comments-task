module.exports = (fn, retries = 1) => {
  if (!fn) {
    return Promise.reject('missing first parameter: fn')
  }
  return doTry(0)

  function doTry (attemptNo) {
    return fn()
      .catch(err => {
        if (attemptNo >= retries) {
          throw err
        }
        return doTry(attemptNo + 1)
      })
  }
}
