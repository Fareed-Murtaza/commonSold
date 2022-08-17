
'use strict';
const productsController = require('./products.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    productsController.create(req, res);
});
router.get('/', (req, res) => {
    productsController.findAll(req, res);
});
router.get('/:productId', (req, res) => {
    productsController.findById(req, res);
});

router.put('/:productId', (req, res) => {
    productsController.update(req, res);
});
router.delete('/:productId', (req, res) => {
    productsController.deleteById(req, res);
});

module.exports = router;
