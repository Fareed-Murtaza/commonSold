const db = require('../models')
const Op = db.Sequelize.Op
const Orders = db.orders
const { sequelize } = require('../models')

exports.getOffsetLimit = ({page=0, limit=20}) => {
  limit = +limit
  let offset = +(page * limit)
  return { limit, offset }
}

exports.inventoryFilterOptions = ({name, price, operator}) => {
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

exports.ordersFilterOptions = ({name, order_status, shipper}) => {
  let orderOptions = {}
  let productOptions = {}

  if (name) {
    orderOptions[Op.or]= [
      {name: {[Op.like]: '%'+name+'%'}},
      {email: {[Op.like]: '%'+name+'%'}},
      {transaction_id: {[Op.like]: '%'+name+'%'}},
      {tracking_number: {[Op.like]: '%'+name+'%'}},
    ]
  }

  if (order_status)
    orderOptions.order_status= {[Op.like]: '%'+order_status+'%'}

  if (shipper)
    orderOptions.shipper_name= {[Op.like]: '%'+shipper+'%'}
  
  return { orderOptions, productOptions }
}

exports.getSaleState = async totalSale => {
  const totalOrders = await Orders.count()

  totalSale = +totalSale
  let average = totalSale/(+totalOrders)

  return { totalSale, average, totalOrders }
}

exports.getTotalSale = async () => {
  let sale = await Orders.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('total_cents')), 'totalSale']],
  })

  return sale[0].dataValues.totalSale
}

exports.getOrderBy = ({sort_table_name, sort_column, sort_order}) => {
  let inventoryOrder = []
  let productOrder = []
  let order = []
  let orderByError = ''

  if(sort_column && sort_order) {
    if(sort_table_name == 'inventories') inventoryOrder.push([[sort_column, sort_order]])
    else if(sort_table_name == 'products') productOrder.push([[sort_column, sort_order]])
    else if(sort_table_name == 'order') order.push([[sort_column, sort_order]])
    else orderByError='Parameters missing for sorting.'
  }
  
  return { order, inventoryOrder, productOrder, orderByError }
}