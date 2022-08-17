
'use strict';

const jwt = require('../utils/jwt');

const authenticationRouteHandler = require('../modules/authentication/router');
const ordersRouteHandler = require('../modules/orders/router');
const inventoriesRouteHandler = require('../modules/inventories/router');
const productsRouteHandler = require('../modules/products/router');

class Routes {
    constructor(app) {
        this.app = app;
    }
    
    /* creating app Routes starts */
    appRoutes() {

        this.app.use("/api/v1/auth", authenticationRouteHandler)
        this.app.use("/api/v1/orders", ordersRouteHandler)
        this.app.use("/api/v1/inventories", jwt.protect, inventoriesRouteHandler)
        this.app.use("/api/v1/products", jwt.protect, productsRouteHandler)
        
        /* Others */
        this.app.get("/", (req, res) => {
            res.send('Server Running');
        })
    }

    routesConfig() {
        this.appRoutes();
    }
}

module.exports = Routes;
