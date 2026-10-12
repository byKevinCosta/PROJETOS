const AcessoController = require('../controller/acesssoController');
const obj_AcessoController = new AcessoController();

 module.exports = (aplicacao) => {
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });
    aplicacao.use('/Login',obj_AcessoController.verificaAcesso());
 }

