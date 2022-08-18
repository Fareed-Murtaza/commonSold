const helper = require('../../utils/helper')
const db = require('../../models')
const attributes = require('../../utils/constants')

const Inventory = db.inventory
const Products = db.products


const Op = db.Sequelize.Op;

// Find All Videos 
exports.findAll = (req, res) => {
  try {
    var { page, limit } = req.query
    var { offset, limit } = helper.getOffsetLimit(page, limit)


    // By name(product_name, sku)

    let name = req.query.name;
    let productOptions = {};
    if (name)
      productOptions.product_name= {[Op.like]: '%'+name+'%'}
      
    // if (priceFrom && priceTo)
    //   options.where.price = {$between: [priceFrom, priceTo]}
    // if (delivery)
    //   options.where.delivery = delivery

    // Product.findAll(options)
    //   .then(products => {
    //       console.log(products)
    //       res.render('product', { products: products });
    //   });

    console.log('filter: ', name, productOptions)


    Products.findAndCountAll({
      where: productOptions,
      include: [{
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
          message: err.message || 'Some error occurred while retrieving video.'
        })
      })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.'
    })
  }
}
