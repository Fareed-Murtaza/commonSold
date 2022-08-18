const helper = require('../../utils/helper')
const db = require('../../models')
const attributes = require('../../utils/constants')

const Orders = db.orders
const Products = db.products
const Inventory = db.inventory

const { sequelize } = require('../../models');

// Find All Orders
exports.findAll = (req, res) => {
  try {
    var { page, limit } = req.query
    var { offset, limit } = helper.getOffsetLimit(page, limit)

    Orders.findAndCountAll({
      include: [
        {
          model: Products,
          include: [{
            model: Inventory,
            attributes: attributes.order_product_inventory
          }],
          attributes: attributes.order_products
        }
      ],
      offset, limit,
      attributes: attributes.orders,
      order: [['name', 'ASC']],
    })
      .then(async orders => {
        let totalSale = await Orders.findAll({
          attributes: [[sequelize.fn('sum', sequelize.col('total_cents')), 'totalSale']],
        });

        totalSale = +totalSale[0].dataValues.totalSale;
        const average = totalSale/(+orders.count);

        res.send({ totalSale, average, orders })
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
