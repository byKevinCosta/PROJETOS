const mssql = require("mssql");
const configuracao = {
    user: BD_USER,
    password: BD_PASSWORD,
    server: BD_SERVER,
    database: BD_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

mssql.connect(configuracao)
    .then(() => {
        console.log("CONEXÃO com o BD SQLSERVER realizada com SUCESSO!");
    })
    .catch((erro) => {
        console.log("ERRO na CONEXÃO com o BD SQLSERVER");
        console.log("\nErro = " + erro);
    });

module.exports = mssql;