const routes = require('express').Router();
const portalAuth = require('./wx-portalAuth');
const customer = require('./wx-customer');
const pay = require('./wx-pay');

routes.use('/portalAuth', portalAuth);
routes.use('/customer', customer);
routes.use('/pay', pay);

module.exports = routes;
