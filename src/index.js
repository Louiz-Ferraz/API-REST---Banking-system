const express = require('express');
const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(express.json());
app.use('/contas', accountsRouter);
app.use('/transacoes', transactionsRouter);

app.listen(3000, () => {
    console.log('Server running on port http://localhost:3000');
});