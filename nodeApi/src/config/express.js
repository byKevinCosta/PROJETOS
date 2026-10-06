const express = require("express");
const aplicacao = express();
const bodyParser = require("body-parser");

aplicacao.use(
    bodyParser.urlencoded({
        extended: true
    })
);

aplicacao.use(express.json());

const rotaUsuario = require("../app/routes/usuariosRouters");
rotaUsuario(aplicacao);

const rotaRecursos = require("../app/routes/recursosRouters");
rotaRecursos(aplicacao);

module.exports = aplicacao;
