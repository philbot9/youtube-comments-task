const Either = require('data.either')

const strTrim = str =>
  str.trim()

const strToInt = s =>
  Either.fromNullable(parseInt(s, 10))
    .chain(x => isNaN(x)
          ? Either.Left(`Cannot parse "${s}" to an int`)
          : Either.of(x))
    .leftMap(_ => `Cannot parse "${s}" to an int`)

const regExec = (regex, str) =>
  Either.fromNullable(regex.exec(str))
    .leftMap(_ => `${str} does not contain a match for ${regex.toString()}`)

module.exports = {
  strTrim,
  strToInt,
  regExec
}
