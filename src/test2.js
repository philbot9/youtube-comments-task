import Rx from 'rxjs'

function first() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(0)
    }, 1000)
  })
}

function second (count) {
  return new Promise (resolve => {
    const time = count < 1 ? 5000 : 1000
    setTimeout(() => {
      resolve(count)
    }, time)
  })
}

const observable = Rx.Observable.fromPromise(first())
  


observable.subscribe(o => console.log('output', o))
