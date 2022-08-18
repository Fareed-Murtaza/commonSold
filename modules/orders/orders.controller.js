const helper = require('../../utils/helper')
const db = require('../../models')

const Orders = db.orders
const Products = db.products
const Inventory = db.inventory

// Find All Orders
exports.findAll = (req, res) => {
  try {
    var { page, limit } = req.query
    var { offset, limit } = helper.getOffsetLimit(page, limit)

    Orders.findAndCountAll({
      include: [
        {
          model: Products,
          include: [
            {
              model: Inventory,
              attributes: ['color', 'size']
            }
          ],
          attributes: ['id', 'product_name']
        }
      ],
      offset, limit,
      attributes: ['id', 'name', 'email', 'order_status', 'total_cents', 'transaction_id', 'shipper_name', 'tracking_number']
    })
      .then(async orders => {
        res.send(orders)
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
