const Task = require('data.task')

const eitherToTask = e => e.fold(Task.rejected, Task.of)

module.exports = eitherToTask
