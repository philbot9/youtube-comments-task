const { expect } = require('chai')
const cheerioUtils = require('../../../lib/utils/cheerio-utils')

const html = `
  <div>
    <h1 id="test" farts="smell">TITLE</h1>
    <ul>
      <li class="many">many_1</li>
      <li class="many">many_2</li>
      <li class="many">many_3</li>
    </ul>
  </div>`

describe('/lib/utils/cheerio-utils.js', () => {
  it('exports an object with methods', () => {
    expect(cheerioUtils).to.be.a('object')
    expect(cheerioUtils.cheerio).to.be.a('function')
    expect(cheerioUtils.cheerioLoad).to.be.a('function')
    expect(cheerioUtils.cheerioFind).to.be.a('function')
    expect(cheerioUtils.cheerioFindAll).to.be.a('function')
    expect(cheerioUtils.cheerioAttr).to.be.a('function')
    expect(cheerioUtils.cheerioFindText).to.be.a('function')
    expect(cheerioUtils.cheerioFindAttr).to.be.a('function')
  })

  it('cheerioLoad retuns a cheerio object', () => {
    cheerioUtils.cheerioLoad(html).fold(
      e => expect.fail(`Got an error ${e}`),
      $ => {
        expect($).to.be.a('object').that.has.property('find')
        expect($.find('#test').text()).to.equal('TITLE')
      }
    )
  })

  it('cheerioFind finds a DOM node', () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFind($, '#test'))
      .fold(
        e => expect.fail(`Got an error ${e}`),
        $t => {
          expect($t).to.be.a('object').that.has.property('find')
          expect($t.text()).to.equal('TITLE')
        }
      )
  })

  it("cheerioFind fails if it can't find a DOM node", () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFind($, '#nothing'))
      .fold(
        e => {
          expect(e).to.equal('No matches for #nothing')
        },
        $t => {
          expect.fail(`expected to fail ${$t}`)
        }
      )
  })

  it('cheerioFindAll finds an array of DOM nodes', () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFindAll($, '.many'))
      .fold(
        e => expect.fail(`Got an error ${e}`),
        $ts => {
          $ts.forEach($t => {
            expect($t).to.be.a('object').that.has.property('find')
            expect($t.text()).to.be.a('string').that.matches(/many_/)
          })
        }
      )
  })

  it('cheerioAttr returns an attribute of a DOM node', () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFind($, '#test'))
      .chain($t => cheerioUtils.cheerioAttr($t, 'farts'))
      .fold(
        e => expect.fail(`Got an error ${e}`),
        t => {
          expect(t).to.equal('smell')
        }
      )
  })

  it('cheerioAttr fails if a DOM node is missing an attribute', () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFind($, '#test'))
      .chain($t => cheerioUtils.cheerioAttr($t, 'blah'))
      .fold(
        e => {
          expect(e).to.be.a('string').that.match(/Attribute blah not found on/)
        },
        $t => {
          expect.fail(`expected to fail ${$t}`)
        }
      )
  })

  it('cheerioFindText finds the text of a DOM node', () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFindText($, '#test'))
      .fold(
        e => expect.fail(`Got an error ${e}`),
        t => {
          expect(t).to.equal('TITLE')
        }
      )
  })

  it('cheerioFindAttr finds an attribute of a DOM node', () => {
    cheerioUtils
      .cheerioLoad(html)
      .chain($ => cheerioUtils.cheerioFindAttr($, '#test', 'farts'))
      .fold(
        e => expect.fail(`Got an error ${e}`),
        t => {
          expect(t).to.equal('smell')
        }
      )
  })
})
