const { expect } = require('chai')
const Either = require('data.either')

const traverse = require('../../../lib/utils/traverse-array')

const arr = [ 'a', 'b', 'c', 'd' ]

describe('/lib/utils/traverse-array.js', () => {
  it('exports a function', () => {
    expect(traverse).to.be.a('function')
  })

  it('traverses the array', () => {
    expect(traverse(arr, Either.of, Either.of))
      .to.deep.equal(Either.of(arr))
  })

  it('fails if an array member fails', () => {
    const error = 'error'
    let count = 0
    const res = traverse(arr, Either.of, x =>
      count++ !== 3 ? Either.of(x) : Either.Left(error))

    res.fold(e => {
      expect(e).to.deep.equal(error)
    }, s => {
      expect.fail('expected to fail')
    })
  })
})
