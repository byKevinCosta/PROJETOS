const UsuariosController = require("../controller/usuariosController");
 const obj_UsuariosController = new UsuariosController();

 module.exports = (aplicacao) => {
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });

    aplicacao.post("/Cadastro", obj_UsuariosController.insereUsuario());
 }