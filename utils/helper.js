
exports.getOffsetLimit = function (page=0, limit=20) {
  limit = +limit
  const offset = +(page * limit)
  return { limit, offset }
}
