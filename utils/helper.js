const db = require('../models')
const Op = db.Sequelize.Op

exports.getOffsetLimit = function ({page=0, limit=20}) {
  limit = +limit
  const offset = +(page * limit)
  return { limit, offset }
}

exports.getFilterOptions = function ({name, price, operator}) {
  let productOptions = {}
  let inventoryOptions = {}
  let error = ''

  if (name)
    productOptions.product_name= {[Op.like]: '%'+name+'%'}
    
  if (price)
    if (operator == 'lt')
      inventoryOptions.price_cents = {[Op.lt]: +price}
    else if (operator == 'gt')
      inventoryOptions.price_cents = {[Op.gt]: +price}
    else if (operator == 'eq')
      inventoryOptions.price_cents = {[Op.eq]: +price}
    else error = 'Invalid Operator.'
  
  return { productOptions, inventoryOptions, error }
}
