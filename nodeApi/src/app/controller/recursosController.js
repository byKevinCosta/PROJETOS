const RecursosCRUD = require("../model/recursosCRUD");
const db = require("../../config/database");

class RecursosController
{

  listarSalas() 
  {
    return function (request, response) {
      const recursosCRUD = new RecursosCRUD(db);
      recursosCRUD
        .geraListagemDeSalas()
        .then((resultados) => {
           console.log("DADOS (JSON) vindo da tabela RECURSOS:");
           console.log(resultados.recordset);
           response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao listar TODOS as salas!"
        });
      });
    };
  }

  listarLaboratorios() 
  {
    return function (request, response) {
      const recursosCRUD = new RecursosCRUD(db);
      recursosCRUD
        .geraListagemDeLaboratorios()
        .then((resultados) => {
           console.log("DADOS (JSON) vindo da tabela RECURSOS:");
           console.log(resultados.recordset);
           response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
          erro: "Erro ao listar TODOS os laboratorios!"
        });
      });
    };
  }

  listarReservasDoRecursoNoDia()
  {
    return ((request,response) =>{
      const dados = request.body;
      const idRec = dados.idRec;
      const dia = dados.dia;
      const recursosCRUD = new RecursosCRUD(db);
      recursosCRUD
        .gerarListagemReservasDoRecursoNoDia(idRec,dia)
        .then((resultados) => {
          console.log(resultados.recordset);
          response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
            erro: `Erro ao listar reservas do recurso ${idRec}, no dia ${dia}`
          });
        });
    });
  }

  listarReservasPorFiltro()
  {
    return ((request,response) =>{
      const dados = {
        "codigo": request.query.codigo,
        "nome": request.query.nome,
        "usuario": request.query.usuario,
        "dia": request.query.dia,
        "inicio": request.query.inicio,
        "fim": request.query.fim
      } 
      const recursosCRUD = new RecursosCRUD(db);
      recursosCRUD
        .gerarListagemReservaPorFiltros(dados)
        .then((resultados) => {
          console.log(resultados.recordset);
          response.json(resultados.recordset);
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
            erro: "Erro ao listar reservas dos recursos"
          });
        });
    });
  }

  reservaRecurso()
  {
    return ((request,response) =>{
      const dados = request.body;
      const {idRec,idUsuario,dataInicio,dataFim} = dados;
      const recursoCRUD = new RecursosCRUD(db);
      recursoCRUD
        .reservarRecurso(idRec,idUsuario,dataInicio,dataFim)
        .then(() => {
            console.log("Reserva realizada com sucesso!");
            response.status(200).end();
        })
        .catch((erro) => {
          console.log(erro);
          response.status(500).json({
            erro: "Erro ao reservar recurso"
          });
        });
    });
  }

  adicionarRecurso()
  {
    return((request,response) => {
      const dados = request.body;
      const recursoCRUD = new RecursosCRUD(db);
      recursoCRUD
        .cadastrarRecurso(dados)
        .then(() =>{
          console.log("Recurso cadastrado com sucesso!");
          response.status(201).end()
        })
        .catch((erro) =>{
          console.error(erro);
          response.status(500).json({
            erro: "Erro ao cadastrar recurso!"
          });
        })
    });
  }

  excluirRecurso()
  {
    return ((request,response) =>{
      const id = request.body.id;
      const recursoCRUD = new RecursosCRUD(db);
      recursoCRUD.excluirRec(id)
        .then(() => {
          console.log("Recurso excluído!");
          response.status(200).end();
        })
        .catch((erro) =>{
          console.log("Erro ao excluir recurso");
          response.status(500).json({
            erro: "Erro ao excluir recurso"
          })
        })

    })
  }

  definirStatusRec()
  {
    return((request,response) =>{
      const dados = request.body;
      const recursoCRUD = new RecursosCRUD(db);
      recursoCRUD
        .alterarStatusRec(dados)
        .then(() => {
          console.log("Status do recurso alterado com sucesso!");
          response.status(200).end();
        })
        .catch((erro)=>{
          console.error(erro);
          response.status(500).json({
            erro: "Erro ao alterar status do recurso!"
          })
        });
    })
  }

  excluirReserva()
  {
    return ((request,response) =>{
      const idUsuario = request.usuario.id;
      const idReserva = request.body.idReserva;
      const recursosCRUD = new RecursosCRUD(db);
      recursosCRUD.exclusaoReserva(idUsuario,idReserva)
        .then(() =>{
          console.log("Exclusão de reserva realizada com sucesso!");
          return response.status(200).end();
        })
        .catch((erro) =>{
          console.log(erro);
          return response.status(500).json({
            erro:`Erro ao excluir reserva id:${idReserva} do usuário do id:${idUsuario}`
          })
        })
    })
  }


}

module.exports = RecursosController;