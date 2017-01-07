const buildCommentStream = require('./index')

buildCommentStream('0w_qjxX0uu4')
  .subscribe({
    error: e => console.error(e),
    next: c => console.log(c),
    complete: () => console.log('DONE')
  })

// const getSession = require('./lib/youtube-api/session-store')
// const request = require('./lib/utils/request')

// getSession('OwFSs_-Kd3Q')
//   .chain(sess => {
//     return request({
//       method: 'POST',
//       url: 'https://www.youtube.com/comment_service_ajax?action_get_comment_replies=1',
//       json: true,
//       form: {
//         page_token: 'EhYSC093RlNzXy1LZDNRwAEAyAEA4AEBGAYyWRpXEiN6MTNmdnhiaWJwZnl1ZDFicjA0Y2dydnJ2em56Y2ZvaHFqdyICCAAqGFVDYVdkNV83SmhiUUJlNGRrblpoc0hKZzILT3dGU3NfLUtkM1E4AEABSPQD',
//         session_token: sess.sessionToken
//       }
//     })
//   })
//   .fork(e => console.error(e),
//         r => console.log(r))

// const buildCPS = require('./lib/comment-page-stream')
//
// buildCPS('kopIN-P712w')
//   .subscribe(c => console.log('page:', c.length))

// const Rx = require('rxjs')
//
// function first (count) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log(count, 'generated')
//       resolve(count)
//     }, 1000)
//   })
// }
//
// function second (count) {
//   return new Promise(resolve => {
//     const time = count < 1 ? 5000 : 1000
//     setTimeout(() => {
//       resolve(count)
//     }, time)
//   })
// }
//
// const observable = Rx.Observable.create(observer => {
//   let count = 0
//   while (count < 5) {
//     first(count++).then(c => observer.next(c))
//   }
// })
//
// // https://github.com/Reactive-Extensions/RxJS/issues/613
//
// observable
//   .concatMap(c => {
//     console.log('first', c)
//     return second(c)
//   })
//   .subscribe(c => console.log(c))
