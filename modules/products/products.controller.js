const db = require("../../models");
const Sequelize = require('sequelize');

const Products = db.products;
const Joi = require('@hapi/joi');

// Create and Save a new Tag
exports.create = async (req, res) => {
    try {
        // Validate request
        const joiSchema = Joi.object({
            product_name: Joi.string().required(),
            description: Joi.string().required(),
            style: Joi.string().required(),
            brand: Joi.string().required(),
            url: Joi.string().allow(''),
            product_type: Joi.string().required(),
            shipping_price: Joi.number().integer().required(),
            note: Joi.string().allow('')
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {

            const user_id = req.userId;
            const product = {
                product_name: req.body.product_name.trim(),
                description: req.body.description.trim(),
                style: req.body.style.trim(),
                brand: req.body.brand.trim(),
                createdAt: new Date(),
                updatedAt: new Date(),
                url: req.body.url.trim(),
                product_type: req.body.product_type.trim(),
                shipping_price: req.body.shipping_price,
                note: req.body.note.trim(),
                admin_id: user_id
            }

            console.log("product: ", product)
            
            Products.create(product)
                .then(product => {
                    console.log('asjhv')
                    res.status(200).send({
                        message: "Product successfully created.",
                        product: product
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the product."
                    });
                });
        }
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find All Products
exports.findAll = (req, res) => {
    try {
        Products.findAll({})
            .then(data => {res.send(data)})
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving products."
                });
            });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred."
        });
    }
};

// Find Product by ID
exports.findById = (req, res) => {
    try {
        Products.findOne({where: { id: req.params.productId }})
            .then(data => {res.send(data)})
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving products."
                });
            });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Update a product by the id in the request
exports.update = (req, res) => {

    try {
        const joiSchema = Joi.object({
            title: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const TagId = crypto.decrypt(req.params.tagId);

            const tag = {
                title: req.body.title.trim(),
                updatedBy: crypto.decrypt(req.userId)
            }

            Tags.update(tag, { where: { id: TagId, isActive: 'Y' } })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Tag was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Tag. Maybe Tag was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating Tag"
                    });
                });
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Delete a product with the specified id in the request
exports.deleteById = (req, res) => {
    try {
        Products.destroy({
            where: { id: req.params.productId }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Product is successfully deleted."
                    });
                } else {
                    res.send({
                        message: `Cannot delete product. Maybe product was not found.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating product"
                });
            });
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};
