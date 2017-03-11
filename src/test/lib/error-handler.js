const { expect } = require('chai')

const errorHandler = require('../../lib/error-handler')
const errorTypes = require('../../lib/error-types')

describe('/lib/error-handler.js', () => {
  it('exports an object with function fields', () => {
    expect(errorHandler).to.be.a('object')
    expect(errorHandler).to.have.property('videoPageError').which.is.a('function')
    expect(errorHandler).to.have.property('noCommentsError').which.is.a('function')
    expect(errorHandler).to.have.property('scraperError').which.is.a('function')
  })

  it(`videoPageError returns a ${errorTypes.VIDEO_ERROR} object if no html is given`, () => {
    const component = 'test-component'
    const operation = 'test-operation'
    const videoId = 'test-video'

    expect(errorHandler.videoPageError({ component, operation, videoId}))
      .to.deep.equal({
      component,
      operation,
      videoId,
      type: errorTypes.VIDEO_ERROR,
      message: 'unknown error'
    })
  })

  it(`videoPageError detects ${errorTypes.VIDEO_ERROR_COUNTRY_RESTRICTION} errors`, () => {
    const component = 'test-component'
    const operation = 'test-operation'
    const videoId = 'test-video'
    const message = 'The uploader has not made this video available in your country.'
    const html = `
      <div>
        <div id="player-unavailable">
          <div>
            <h1>${message}</h1>
          </div>
        </div>
      </div>
    `

    expect(errorHandler.videoPageError({ component, operation, videoId, html}))
      .to.deep.equal({
      component,
      operation,
      videoId,
      message,
      type: errorTypes.VIDEO_ERROR_COUNTRY_RESTRICTION
    })
  })

  it(`videoPageError detects ${errorTypes.VIDEO_ERROR_UNAVAILABLE} errors`, () => {
    const component = 'test-component'
    const operation = 'test-operation'
    const videoId = 'test-video'
    const message = 'This video is no longer available due to a copyright claim by Your Mama.'
    const html = `
      <div>
        <div id="player-unavailable">
          <div>
            <h1>${message}</h1>
          </div>
        </div>
      </div>
    `

    expect(errorHandler.videoPageError({ component, operation, videoId, html}))
      .to.deep.equal({
      component,
      operation,
      videoId,
      message,
      type: errorTypes.VIDEO_ERROR_UNAVAILABLE
    })
  })

  it(`videoPageError detects ${errorTypes.VIDEO_ERROR_PRIVATE} errors`, () => {
    const component = 'test-component'
    const operation = 'test-operation'
    const videoId = 'test-video'
    const message = 'This video is private.'
    const html = `
      <div>
        <div id="player-unavailable">
          <div>
            <h1>${message}</h1>
          </div>
        </div>
      </div>
    `

    expect(errorHandler.videoPageError({ component, operation, videoId, html}))
      .to.deep.equal({
      component,
      operation,
      videoId,
      message,
      type: errorTypes.VIDEO_ERROR_PRIVATE
    })
  })

  it(`noCommentsError returns a ${errorTypes.VIDEO_ERROR_NO_COMMENTS} error`, () => {
    const component = 'test-component'
    const operation = 'test-operation'
    const videoId = 'test-video'
    const message = 'The video does not have any comments.'

    expect(errorHandler.noCommentsError({ component, operation, videoId}))
      .to.deep.equal({
      component,
      operation,
      videoId,
      message,
      type: errorTypes.VIDEO_ERROR_NO_COMMENTS
    })
  })

  it(`scraperError returns a ${errorTypes.SCRAPER_ERROR} error`, () => {
    const component = 'test-component'
    const operation = 'test-operation'
    const videoId = 'test-video'
    const message = 'The video does not have any comments.'

    expect(errorHandler.scraperError({ component, operation, videoId, message}))
      .to.deep.equal({
      component,
      operation,
      videoId,
      message,
      type: errorTypes.SCRAPER_ERROR
    })
  })
})
