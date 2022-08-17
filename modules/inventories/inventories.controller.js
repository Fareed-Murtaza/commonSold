const db = require("../../models");
const Joi = require('@hapi/joi');

const Inventory = db.inventory;

const Op = db.Sequelize.Op;
const { sequelize } = require("../../models");

// Find All Videos 
exports.findAll = (req, res) => {
  try {
    Inventory.findAll({})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving video."
        });
      });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred."
    });
  }
};
