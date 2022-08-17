const db = require("../../models");

const Orders = db.orders;
const Products = db.products;
const Inventory = db.inventory;

const { Op } = require("sequelize");
const { sequelize } = require("../../models");

// Find All Orders
exports.findAll = (req, res) => {
    try {
        Orders.findAll({
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
            attributes: ['id', 'name', 'email', 'order_status', 'total_cents', 'transaction_id', 'shipper_name', 'tracking_number']
        })
            .then(async orders => {
                res.send(orders);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving orders."
                });
            });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};
