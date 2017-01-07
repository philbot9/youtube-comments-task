const Either = require('data.either')

const strTrim = str =>
  str.trim()

const strToInt =
  Either.try(s => parseInt(s, 10))

const regExec = (regex, str) =>
  Either.fromNullable(regex.exec(str))
    .leftMap(_ => `${str} does not contain a match for ${regex.toString}`)

module.exports = {
  strTrim,
  strToInt,
  regExec
}
