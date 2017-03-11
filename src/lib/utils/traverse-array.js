/*
 * Source: https://github.com/DrBoolean/immutable-ext
 */

const traverse = (arr, point, f) =>
  arr.reduce((ys, x) =>
    f(x).map(x => y => y.concat([x])).ap(ys), point([]))

module.exports = traverse
