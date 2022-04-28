const express = require('express');
const {
    deposit,
    withdraw,
    transfer
} = require('../controllers/transactions');

const routes = express.Router();

routes.post('/depositar', deposit);
routes.post('/sacar', withdraw);
routes.post('/transferir', transfer);

module.exports = routes;