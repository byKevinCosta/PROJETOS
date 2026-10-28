const RecursosController = require("../controller/recursosController");
const obj_RecursosController = new RecursosController();
const Autenticador = require("../middleware/authMiddleware");
const autenticador = new Autenticador();

 module.exports = (aplicacao) => {
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });
    //rotas protegidar, precisa de fazer login para ter permissao
    aplicacao.get("/Salas", autenticador.autenticar, obj_RecursosController.listarSalas());
    aplicacao.get("/Lab", autenticador.autenticar, obj_RecursosController.listarSalas());
    aplicacao.post("/ReservaNoDia", autenticador.autenticar, obj_RecursosController.listarReservasDoRecursoNoDia());
    aplicacao.get("/Reservas", autenticador.autenticar, obj_RecursosController.listarReservasPorFiltro());
    aplicacao.post("/Reservar",autenticador.autenticar, obj_RecursosController.reservaRecurso());
    aplicacao.post("/Rec",autenticador.autenticarAdm, obj_RecursosController.adicionarRecurso());
    aplicacao.delete("/Rec",autenticador.autenticarAdm, obj_RecursosController.excluirRecurso());
    aplicacao.delete("/Reservas",autenticador.autenticar, obj_RecursosController.excluirReserva());
    aplicacao.put("/AlterarStatusRec",autenticador.autenticarAdm, obj_RecursosController.definirStatusRec());
    aplicacao.post("/StatusRec",autenticador.autenticarAdm, obj_RecursosController.statusRec());
    
 }