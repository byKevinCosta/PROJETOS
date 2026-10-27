const UsuariosController = require("../controller/usuariosController");
const obj_UsuariosController = new UsuariosController();
const Autenticador = require("../middleware/authMiddleware");
const autenticador = new Autenticador();

 module.exports = (aplicacao) => {
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });

    aplicacao.post("/Cadastro", obj_UsuariosController.insereUsuario());
    aplicacao.get("/Usuarios", autenticador.autenticarAdm, obj_UsuariosController.listaUsuarios());
    aplicacao.delete("/Usuarios",autenticador.autenticar,obj_UsuariosController.excluirUser());
 }