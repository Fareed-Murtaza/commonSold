const helper = require('../../utils/helper')
const db = require('../../models')
const attributes = require('../../utils/constants')

const Inventory = db.inventory
const Products = db.products

// Find All inventories 
exports.findAll = (req, res) => {
  try {
    var { page, limit, name, price, operator } = req.query

    var { offset, limit } = helper.getOffsetLimit(page, limit)    
    let { productOptions, inventoryOptions, error } = helper.getFilterOptions(name, price, operator)

    if (error) 
      return res.status(500).send({error})

    Products.findAndCountAll({
      where: productOptions,
      include: [{
        where: inventoryOptions,
        model: Inventory,
        attributes: attributes.inventory,
      }],
      offset, limit,
      attributes: attributes.inventory_products,
      order: [['product_name', 'ASC']],
    })
      .then(data => res.send(data))
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
