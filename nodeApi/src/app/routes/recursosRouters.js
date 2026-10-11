const RecursosController = require("../controller/recursosController");
 const obj_RecursosController = new RecursosController();

 module.exports = (aplicacao) => {
    aplicacao.use((request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*");
        next();
    });

    aplicacao.get("/Salas", obj_RecursosController.listarSalas());
    aplicacao.get("/Lab", obj_RecursosController.listarLaboratorios());
    aplicacao.post("/Reserva", obj_RecursosController.listarReservasDoRecursoNoDia());
    aplicacao.post("/Reservar",obj_RecursosController.reservaRecurso());
 }