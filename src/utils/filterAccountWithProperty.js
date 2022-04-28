const filterAccountWithProperty = ((property, typeOfProperty, accounts) => {
    if (typeOfProperty === 'cpf') {
        return accounts.filter(conta => {
            return conta.usuario.cpf === property;
        })
    }
    if (typeOfProperty === 'email') {
        return accounts.filter(conta => {
            return conta.usuario.email === property;
        })
    }
    if (typeOfProperty === 'numero') {
        return accounts.filter(conta => {
            return conta.numero === property;
        })
    }
});

module.exports = filterAccountWithProperty;