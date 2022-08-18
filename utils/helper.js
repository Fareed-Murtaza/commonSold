
exports.getOffsetLimit = function (page, limit) {
  limit = +limit
  const offset = +(page * limit)
  return { limit, offset }
};
