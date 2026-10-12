const AcessoCRUD = require('../model/acessoCRUD');
const db = require("../../config/database");

class acessoController
{
    verificaAcesso()
    {
        return((request,response) =>{
            const dados = request.body;
            const acessoCRUD = new AcessoCRUD(db);
            acessoCRUD.verificarAcesso(dados)
                .then(() =>{
                    console.log("Login efetivado com sucesso!");
                    response.status(200).json({
                        entrou: "true"
                    }) ///vou mudar para colocar o jwt no futuro
                })
                .catch((erro) => {
                    console.error(erro);
                    response.status(500).json({
                        erro: "Erro ao verificar usuario e senha"
                    });
                });
        });
    }
}

module.exports = acessoController;