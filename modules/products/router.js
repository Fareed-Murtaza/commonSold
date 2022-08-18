'use strict'

const productsController = require('./products.controller')
const middleware = require('../../utils/middleware')

const express = require('express')
const router = express.Router()

router.post('/', middleware.product, productsController.create)

router.get('/', productsController.findAll)
router.get('/:productId', productsController.findById)

router.put('/:productId', productsController.update)
router.delete('/:productId', productsController.deleteById)

module.exports = router
