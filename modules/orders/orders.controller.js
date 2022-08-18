const helper = require('../../utils/helper')
const db = require('../../models')
const { attributes, order } = require('../../utils/constants')
const { sequelize } = require('../../models')

const Inventory = db.inventory
const Orders = db.orders
const Products = db.products

// Find All Orders
exports.findAll = (req, res) => {
  try {
    let { offset, limit } = helper.getOffsetLimit(req.query)

    Orders.findAndCountAll({
      include: [{
        model: Products,
        include: [{
          model: Inventory,
          attributes: attributes.order_product_inventory
        }],
        attributes: attributes.order_products
      }],
      offset, limit,
      attributes: attributes.orders,
      order: order.name,
    })
      .then(async orders => {
        let totalSale = await Orders.findAll({
          attributes: [[sequelize.fn('sum', sequelize.col('total_cents')), 'totalSale']],
        })

        totalSale = +totalSale[0].dataValues.totalSale
        const average = totalSale/(+orders.count)

        res.send({ totalSale, average, count: orders.count, rows: orders.rows })
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
