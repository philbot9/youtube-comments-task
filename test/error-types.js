const { expect } = require('chai')

const errorTypes = require('../error-types')

describe('/error-types.js', () => {
  it('exports an errorTypes object', () => {
    expect(errorTypes).to.be.an('object')
    expect(errorTypes.SCRAPER_ERROR).to.equal('scraper-error')
    expect(errorTypes.VIDEO_ERROR).to.equal('video-error')
  })
})
