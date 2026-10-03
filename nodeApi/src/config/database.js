const mssql = require("mssql");
const configuracao = {
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    server: process.env.BD_SERVER,
    database: process.env.BD_DATABASE,
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