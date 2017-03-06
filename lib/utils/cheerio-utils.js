const cheerio = require('cheerio')
const Either = require('data.either')

const cheerioLoad = html =>
  Either.fromNullable(cheerio.load(`<div id="_ROOT">${html}</div>`))
    .leftMap(_ => `Cheerio is unable to load ${html}`)
    .map($ => $('#_ROOT'))

const cheerioFind = ($e, sel) =>
  $e.find(sel).length > 0
    ? Either.of($e.find(sel))
    : Either.Left(`No matches for ${sel}`)

const cheerioFindAll = ($e, sel) =>
  cheerioFind($e, sel)
    .map($m => $m.toArray().map(cheerio))

const cheerioAttr = ($e, attr) =>
  Either.fromNullable($e.attr(attr))
    .leftMap(_ => `Attribute ${attr} not found on ${$e}`)

const cheerioFindText = ($e, sel) =>
  cheerioFind($e, sel)
    .map(r => r.text())

const cheerioFindAttr = ($e, sel, attr) =>
  cheerioFind($e, sel)
    .chain($r => cheerioAttr($r, attr))

module.exports = {
  cheerio,
  cheerioLoad,
  cheerioFind,
  cheerioFindAll,
  cheerioAttr,
  cheerioFindText,
  cheerioFindAttr
}
