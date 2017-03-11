const { expect } = require('chai')
const strUtils = require('../../../lib/utils/string-utils')

describe('/lib/utils/string-utils.js', () => {
  it('exports an object with methods', () => {
    expect(strUtils).to.be.a('object')
    expect(strUtils.strTrim).to.be.a('function')
    expect(strUtils.strToInt).to.be.a('function')
    expect(strUtils.regExec).to.be.a('function')
  })

  it('strTrim trims a string', () => {
    expect(strUtils.strTrim(' \n blah   \t')).to.equal('blah')
  })

  it('strToInt parses a string to an int', () => {
    strUtils.strToInt('199')
      .fold(e => expect.fail(`got an error ${e}`),
        x => expect(x).to.equal(199))
  })

  it('strToInt fails if the string cannot be parsed', () => {
    strUtils.strToInt('ABSC')
      .fold(e => {
        expect(e).to.exist
      },
        x => {
          expect.fail(`expected to fail ${x}`)
        })
  })

  it('regExec executes a regular expression on a string', () => {
    strUtils.regExec(/a(b)c/, 'abc')
      .fold(e => expect.fail(`got an error ${e}`),
        m => {
          expect(m).to.be.a('array').of.length(2)
          expect(m[1]).to.equal('b')
        })
  })

  it('regExec failes if there is no match', () => {
    const reg = /a(b)c/
    const str = 'xyz'

    strUtils.regExec(reg, str)
      .fold(e => {
        expect(e).to.equal(`${str} does not contain a match for ${reg.toString()}`)
      }, x => expect.fail(`expected to fail ${x}`))
  })
})
