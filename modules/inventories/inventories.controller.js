const db = require('../../models')
const helper = require('../../utils/helper')
const { attributes, order } = require('../../utils/constants')

const Inventory = db.inventory
const Products = db.products

// Find All inventories 
exports.findAll = (req, res) => {
  try {
    var { offset, limit } = helper.getOffsetLimit(req.query)
    let { productOptions, inventoryOptions, error } = helper.getFilterOptions(req.query)

    if (error) return res.status(500).send({error})

    Inventory.findAndCountAll({
      where: inventoryOptions,
      include: [{
        model: Products,
        where: productOptions,
        attributes: attributes.inventory_products,
        order: order.product_name,
      }],
      offset, limit, 
      attributes: attributes.inventory,
    })
      .then(inventory => res.send(inventory))
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving inventories.'
        })
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.'
    })
  }
}
