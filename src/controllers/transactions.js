const path = require('path');
const transactionWithAllProperties = require('../utils/transactionWithAllProperties');
const filterAccountWithProperty = require('../utils/filterAccountWithProperty');
const passwordValidator = require('../utils/passwordValidator');
const stringifyDatabase = require('../utils/stringifyDatabase');
const writeFileDatabase = require('../utils/writeFileDatabase');

let {
    banco,
    contas,
    saques,
    depositos,
    transferencias
} = require('../database/bancodedados');
let databaseFilePath = path.join('src', 'database', 'bancodedados.js');

const deposit = (req, res) => {
    if (transactionWithAllProperties(req.body, 'deposit') !== "Campos informados!") {
        return res.status(400).json({ "mensagem": transactionWithAllProperties(req.body, 'deposit') });
    }

    let { numero_conta, valor } = req.body;

    let selectedAccount = filterAccountWithProperty(numero_conta, 'numero', contas);

    if (selectedAccount.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta com número ${numero_conta}!` });
    }

    selectedAccount[0].saldo += Number(valor);
    depositos.push({
        data: new Date(),
        numero_conta,
        valor
    });

    const databaseString = stringifyDatabase(banco, contas, saques, depositos, transferencias);

    try {
        writeFileDatabase(databaseFilePath, databaseString);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json(error);
    }

}

const withdraw = (req, res) => {
    if (transactionWithAllProperties(req.body, 'withdraw') !== "Campos informados!") {
        return res.status(400).json({ "mensagem": transactionWithAllProperties(req.body, 'withdraw') });
    }

    let { numero_conta, valor, senha } = req.body;

    let selectedAccount = filterAccountWithProperty(numero_conta, 'numero', contas);

    if (selectedAccount.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta com número ${numero_conta}!` });
    }

    if (!passwordValidator(senha, selectedAccount[0].usuario.senha)) {
        return res.status(401).json({ "mensagem": "A senha da conta informada é inválida!" });
    }

    if (selectedAccount[0].saldo < Number(valor)) {
        return res.status(400).json({ "mensagem": `O saldo é de R$${(selectedAccount[0].saldo / 100).toFixed(2)}, insuficiente para completar saque de R$${(Number(valor) / 100).toFixed(2)} ` });
    }

    selectedAccount[0].saldo -= Number(valor);
    saques.push({
        data: new Date(),
        numero_conta,
        valor
    });

    const databaseString = stringifyDatabase(banco, contas, saques, depositos, transferencias);

    try {
        writeFileDatabase(databaseFilePath, databaseString);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json(error);
    }
}

const transfer = (req, res) => {
    if (transactionWithAllProperties(req.body, 'transfer') !== "Campos informados!") {
        return res.status(400).json({ "mensagem": transactionWithAllProperties(req.body, 'transfer') });
    }

    let { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    let selectedAccountOrigin = filterAccountWithProperty(numero_conta_origem, 'numero', contas);

    if (selectedAccountOrigin.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta de origem com número ${numero_conta_origem}!` });
    }

    let selectedAccountDestination = filterAccountWithProperty(numero_conta_destino, 'numero', contas);

    if (selectedAccountDestination.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta de destino com número ${numero_conta_destino}!` });
    }

    if (!passwordValidator(senha, selectedAccountOrigin[0].usuario.senha)) {
        return res.status(401).json({ "mensagem": "A senha da conta de origem informada é inválida!" });
    }

    if (selectedAccountOrigin[0].saldo < Number(valor)) {
        return res.status(400).json({ "mensagem": `O saldo da conta de origem é de R$${(selectedAccountOrigin[0].saldo / 100).toFixed(2)}, insuficiente para completar transferência de R$${(Number(valor) / 100).toFixed(2)} ` });
    }

    selectedAccountOrigin[0].saldo -= Number(valor);
    selectedAccountDestination[0].saldo += Number(valor);

    transferencias.push({
        data: new Date(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    });

    const databaseString = stringifyDatabase(banco, contas, saques, depositos, transferencias);

    try {
        writeFileDatabase(databaseFilePath, databaseString);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    deposit,
    withdraw,
    transfer
}