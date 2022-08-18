const helper = require('../../utils/helper')
const db = require('../../models')

const Inventory = db.inventory
const Products = db.products

// Find All Videos 
exports.findAll = (req, res) => {
  try {
    var { page, limit } = req.query
    var { offset, limit } = helper.getOffsetLimit(page, limit)

    Inventory.findAndCountAll({
      include: [
        {
          model: Products,
          attributes: ['product_name', 'id']
        }
      ],
      offset, limit,
      attributes: ['id', 'sku', 'quantity', 'color', 'size', 'cost_cents', 'price_cents']
    })
      .then(data => res.send(data))
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving video.'
        })
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.'
    })
  }
}
