const db = require('../../models')
const helper = require('../../utils/helper')
const { attributes, order } = require('../../utils/constants')

const Inventory = db.inventory
const Orders = db.orders
const Products = db.products

// Find All Orders
exports.findAll = (req, res) => {
  try {
    let { offset, limit } = helper.getOffsetLimit(req.query)
    let { orderOptions, productOptions } = helper.ordersFilterOptions(req.query)

    Orders.findAndCountAll({
      where: orderOptions,
      include: [{
        model: Products,
        where: productOptions,
        include: [{
          model: Inventory,
          attributes: attributes.order_product_inventory
        }],
        attributes: attributes.order_products
      }],
      offset, limit, order: order.name,
      attributes: attributes.orders
    })
      .then(async ({count, rows}) => {
        let sale = await helper.getTotalSale()
        let { totalOrders, totalSale, average } = await helper.getSaleState(sale)

        res.send({ totalSale, average, count: totalOrders, rows })
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving orders.'
        })
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.'
    })
  }
}
