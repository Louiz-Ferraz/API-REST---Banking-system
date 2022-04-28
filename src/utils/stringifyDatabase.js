const stringifyDatabase = (
    banco,
    contas,
    saques,
    depositos,
    transferencias
) => {

    bancoString = JSON.stringify(banco);
    bancoString = `banco: ${bancoString},`;
    contasString = JSON.stringify(contas);
    contasString = `contas: ${contasString},`;
    saquesString = JSON.stringify(saques);
    saquesString = `saques: ${saquesString},`;
    depositosString = JSON.stringify(depositos);
    depositosString = `depositos: ${depositosString},`;
    transferenciasString = JSON.stringify(transferencias);
    transferenciasString = `transferencias: ${transferenciasString}`;

    return bancoString + contasString + saquesString + depositosString + transferenciasString;
}

module.exports = stringifyDatabase;