const db = require('../models')
const Op = db.Sequelize.Op
const Orders = db.orders
const { sequelize } = require('../models')

exports.getOffsetLimit = ({page=0, limit=20}) => {
  limit = +limit
  let offset = +(page * limit)
  return { limit, offset }
}

exports.getFilterOptions = ({name, price, operator}) => {
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

exports.getSaleState = (totalSale, totalOrders) => {
  totalSale = +totalSale
  let average = totalSale/(+totalOrders)

  return { totalSale, average }
}

exports.getTotalSale = async () => {
  let sale = await Orders.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('total_cents')), 'totalSale']],
  })

  return sale[0].dataValues.totalSale
}
