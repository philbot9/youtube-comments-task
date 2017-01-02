const Rx = require('rxjs')

function first (count) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(count, 'generated')
      resolve(count)
    }, 1000)
  })
}

function second (count) {
  return new Promise(resolve => {
    const time = count < 1 ? 5000 : 1000
    setTimeout(() => {
      resolve(count)
    }, time)
  })
}

const observable = Rx.Observable.create(observer => {
  let count = 0
  while (count < 5) {
    first(count++).then(c => observer.next(c))
  }
})

// https://github.com/Reactive-Extensions/RxJS/issues/613

observable
  .concatMap(c => {
    console.log('first', c)
    return second(c)
  })
  .subscribe(c => console.log(c))
