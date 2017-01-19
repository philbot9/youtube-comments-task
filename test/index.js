const { expect } = require('chai')
const { Observable } = require('rxjs')

const commentStream = require('../index')

describe('/index.js', () => {
  it(' - returns an Rx Observable', () => {
    const stream = commentStream('videoId')
    expect(stream).to.be.an.instanceof(Observable)
  })
})
