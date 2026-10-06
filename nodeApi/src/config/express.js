const express = require("express");
const aplicacao = express();
const bodyParser = require("body-parser");

aplicacao.use(
    bodyParser.urlencoded({
        extended: true
    })
);

aplicacao.use((req, res, next) => {
  // Permite a origem do seu frontend React
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  
  // Resolve o erro exato do seu console: libera o envio de JSON (content-type)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Libera os métodos que você vai usar
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Responde imediatamente se for uma requisição de verificação (Preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

aplicacao.use(express.json());

const rotaUsuario = require("../app/routes/usuariosRouters");
rotaUsuario(aplicacao);

const rotaRecursos = require("../app/routes/recursosRouters");
rotaRecursos(aplicacao);

module.exports = aplicacao;
