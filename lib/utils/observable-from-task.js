const { Observable } = require('rxjs')

const observableFromTask = task =>
  Observable.create(observer =>
    task.fork(e => observer.error(e),
              v => {
                observer.next(v)
                observer.complete()
              }))

module.exports = observableFromTask
