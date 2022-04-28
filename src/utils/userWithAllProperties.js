const userWithAllProperties = (accountObject => {
    if (accountObject.nome === undefined || accountObject.nome.trim() === "") {
        return "Nome deve ser informado!";
    }
    if (accountObject.cpf === undefined || accountObject.cpf.trim() === "") {
        return "CPF deve ser informado!";
    }
    if (accountObject.data_nascimento === undefined || accountObject.data_nascimento.trim() === "") {
        return "Data de nascimento deve ser informada!";
    }
    if (accountObject.telefone === undefined || accountObject.telefone.trim() === "") {
        return "Telefone deve ser informado!";
    }
    if (accountObject.email === undefined || accountObject.email.trim() === "") {
        return "E-mail deve ser informado!";
    }
    if (accountObject.senha === undefined || accountObject.senha.trim() === "") {
        return "Senha deve ser informada!";
    }
    return "Campos informados!";
});

module.exports = userWithAllProperties;