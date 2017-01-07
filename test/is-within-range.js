const isWithinRange = (v1, v2, range) =>
  v1 > (v2 - range) && v1 < (v2 + range)

module.exports = isWithinRange
