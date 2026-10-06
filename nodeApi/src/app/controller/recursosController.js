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

}

module.exports = RecursosController;