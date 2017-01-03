const Task = require('data.task')
const { curry } = require('core.lambda')

/*
 * Takes a number of retries and a function (fn) that returns a task.
 * If the returned task is rejected, it calls fn until the task is resolved or
 * the given retry limit is exceeded.
 */

const retryTask = (retries, fn) => {
  const doTry = attemptNo => fn().orElse(e => (attemptNo < retries) ? doTry(attemptNo + 1) : Task.rejected(e))

  return doTry(0)
}

module.exports = curry(2, retryTask)
