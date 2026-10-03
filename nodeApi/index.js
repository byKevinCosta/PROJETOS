require('dotenv').config(); //para puxar as variaveis do .env
const aplicacao = require("./src/config/express");

aplicacao.listen(8081, () => {
    console.log("API node rodando na porta 8081");
});
