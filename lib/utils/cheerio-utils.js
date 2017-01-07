const cheerio = require('cheerio')
const Either = require('data.either')

const cheerioFind = ($e, sel) =>
  $e.find(sel).length > 0
    ? Either.of($e.find(sel))
    : Either.Left(`No matches for ${sel}`)

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
  cheerioFind,
  cheerioAttr,
  cheerioFindText,
  cheerioFindAttr
}
