const express = require('express');
const {
    listAccounts,
    createAccount,
    updateAccountUser,
    deleteAccount,
    showBalance,
    showStatement
} = require('../controllers/accounts');

const routes = express.Router();

routes.get('/', listAccounts);
routes.post('/', createAccount);
routes.put('/:numeroConta/usuario', updateAccountUser);
routes.delete('/:numeroConta', deleteAccount);
routes.get('/saldo', showBalance);
routes.get('/extrato', showStatement);

module.exports = routes;