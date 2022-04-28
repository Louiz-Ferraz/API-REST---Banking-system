const transactionWithAllProperties = ((transactionObject, typeOfTransaction) => {

    if (typeOfTransaction === 'deposit') {
        if (transactionObject.numero_conta === undefined || transactionObject.numero_conta.trim() === "") {
            return "Número da conta deve ser informado!";
        }
        if (transactionObject.valor === undefined) {
            return "Valor do depósito deve ser informado!";
        }
        if (transactionObject.valor <= 0) {
            return "Valor do depósito deve ser positivo e diferente de zero!";
        }
    }

    if (typeOfTransaction === 'withdraw') {
        if (transactionObject.numero_conta === undefined || transactionObject.numero_conta.trim() === "") {
            return "Número da conta deve ser informado!";
        }
        if (transactionObject.valor === undefined) {
            return "Valor do saque deve ser informado!";
        }
        if (transactionObject.valor <= 0) {
            return "Valor do saque deve ser positivo e diferente de zero!";
        }
        if (transactionObject.senha === undefined || transactionObject.senha.trim() === "") {
            return "Senha deve ser informada!";
        }
    }

    if (typeOfTransaction === 'transfer') {
        if (transactionObject.numero_conta_origem === undefined || transactionObject.numero_conta_origem.trim() === "") {
            return "Número da conta de origem deve ser informado!";
        }
        if (transactionObject.numero_conta_destino === undefined || transactionObject.numero_conta_destino.trim() === "") {
            return "Número da conta de destino deve ser informado!";
        }
        if (transactionObject.valor === undefined) {
            return "Valor da transferência deve ser informado!";
        }
        if (transactionObject.valor <= 0) {
            return "Valor da transferência deve ser positivo e diferente de zero!";
        }
        if (transactionObject.senha === undefined || transactionObject.senha.trim() === "") {
            return "Senha deve ser informada!";
        }
        if (transactionObject.numero_conta_origem === transactionObject.numero_conta_destino) {
            return "As contas de origem e destino devem ser diferentes!";
        }
    }

    if (typeOfTransaction === 'balance' || typeOfTransaction === 'statement') {
        if (transactionObject.numero_conta === undefined || transactionObject.numero_conta.trim() === "") {
            return "Número da conta deve ser informado!";
        }
        if (transactionObject.senha === undefined || transactionObject.senha.trim() === "") {
            return "Senha deve ser informada!";
        }
    }

    return "Campos informados!";

});

module.exports = transactionWithAllProperties;