const { expect } = require('chai')

const fetchComments = require('../index')

describe('/index.js', () => {
  it(' - exports a function', () => {
    expect(fetchComments).to.be.a('function')
  })
})
