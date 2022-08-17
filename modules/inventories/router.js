
'use strict';
const express = require("express");
const router = express.Router();
const inventoriesController = require('./inventories.controller');

router.get('/', (req, res) => {
    inventoriesController.findAll(req, res);
});

module.exports = router;
