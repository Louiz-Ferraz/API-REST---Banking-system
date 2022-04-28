const path = require('path');
const { v4: uuidv4 } = require('uuid');
const undefinedOrBlankValidator = require('../utils/undefinedOrBlankValidator');
const passwordValidator = require('../utils/passwordValidator');
const filterAccountWithProperty = require('../utils/filterAccountWithProperty');
const userWithAllProperties = require('../utils/userWithAllProperties');
const transactionWithAllProperties = require('../utils/transactionWithAllProperties');
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

const listAccounts = (req, res) => {
    const { senha_banco } = req.query;

    if (!undefinedOrBlankValidator(senha_banco)) {
        res.status(401).json({ "mensagem": "A senha do banco precisa ser informada!" });
    }

    if (!passwordValidator(senha_banco, banco.senha)) {
        res.status(401).json({ "mensagem": "A senha do banco informada é inválida!" });
    }

    res.status(200).json(contas);
}

const createAccount = (req, res) => {
    if (userWithAllProperties(req.body) !== "Campos informados!") {
        return res.status(400).json({ "mensagem": userWithAllProperties(req.body) });
    }

    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;

    if (
        filterAccountWithProperty(cpf, 'cpf', contas).length !== 0 ||
        filterAccountWithProperty(email, 'email', contas).length !== 0
    ) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    contas.push({
        numero: uuidv4(),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    })

    const databaseString = stringifyDatabase(banco, contas, saques, depositos, transferencias);

    try {
        writeFileDatabase(databaseFilePath, databaseString);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateAccountUser = (req, res) => {
    if (userWithAllProperties(req.body) !== "Campos informados!") {
        return res.status(400).json({ "mensagem": userWithAllProperties(req.body) });
    }

    const { numeroConta } = req.params;

    let selectedAccount = filterAccountWithProperty(numeroConta, 'numero', contas);
    if (selectedAccount.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta com número ${numeroConta}!` });
    }

    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;


    if (
        filterAccountWithProperty(cpf, 'cpf', contas).length !== 0 ||
        filterAccountWithProperty(email, 'email', contas).length !== 0
    ) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    selectedAccount[0].usuario.nome = nome;
    selectedAccount[0].usuario.cpf = cpf;
    selectedAccount[0].usuario.data_nascimento = data_nascimento;
    selectedAccount[0].usuario.telefone = telefone;
    selectedAccount[0].usuario.email = email;
    selectedAccount[0].usuario.senha = senha;

    const databaseString = stringifyDatabase(banco, contas, saques, depositos, transferencias);

    try {
        writeFileDatabase(databaseFilePath, databaseString);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteAccount = (req, res) => {
    const { numeroConta } = req.params;

    let selectedAccount = filterAccountWithProperty(numeroConta, 'numero', contas);

    if (selectedAccount.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta com número ${numeroConta}!` });
    }

    if (selectedAccount[0].saldo !== 0) {
        return res.status(400).json({ "mensagem": `A conta possui saldo de R$${(selectedAccount[0].saldo / 100).toFixed(2)} e ele deve ser zero para que seja realizada a exclusão!` });
    }

    contas = contas.filter(conta => {
        return conta.numero !== numeroConta;
    })

    const databaseString = stringifyDatabase(banco, contas, saques, depositos, transferencias);

    try {
        writeFileDatabase(databaseFilePath, databaseString);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json(error);
    }
}

const showBalance = (req, res) => {
    if (transactionWithAllProperties(req.query, 'balance') !== "Campos informados!") {
        return res.status(400).json({ "mensagem": transactionWithAllProperties(req.query, 'balance') });
    }

    const { numero_conta, senha } = req.query;

    let selectedAccount = filterAccountWithProperty(numero_conta, 'numero', contas);

    if (selectedAccount.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta com número ${numero_conta}!` });
    }

    if (!passwordValidator(senha, selectedAccount[0].usuario.senha)) {
        return res.status(401).json({ "mensagem": "A senha da conta informada é inválida!" });
    }

    return res.status(200).json({ "saldo": selectedAccount[0].saldo });
}

const showStatement = (req, res) => {
    if (transactionWithAllProperties(req.query, 'statement') !== "Campos informados!") {
        return res.status(400).json({ "mensagem": transactionWithAllProperties(req.query, 'statement') });
    }

    const { numero_conta, senha } = req.query;

    let selectedAccount = filterAccountWithProperty(numero_conta, 'numero', contas);

    if (selectedAccount.length === 0) {
        return res.status(404).json({ "mensagem": `Não foi encontrada conta com número ${numero_conta}!` });
    }

    if (!passwordValidator(senha, selectedAccount[0].usuario.senha)) {
        return res.status(401).json({ "mensagem": "A senha da conta informada é inválida!" });
    }

    let statement = {
        depositos: depositos.filter(deposito => {
            return deposito.numero_conta === numero_conta;
        }),
        saques: saques.filter(saque => {
            return saque.numero_conta === numero_conta;
        }),
        transferenciasEnviadas: transferencias.filter(transferencia => {
            return transferencia.numero_conta_origem === numero_conta;
        }),
        transferenciasRecebidas: transferencias.filter(transferencia => {
            return transferencia.numero_conta_destino === numero_conta;
        })
    };

    return res.status(200).json(statement);
}

module.exports = {
    listAccounts,
    createAccount,
    updateAccountUser,
    deleteAccount,
    showBalance,
    showStatement
}