const AcessoCRUD = require('../model/acessoCRUD');
const db = require("../../config/database");
const jwt = require('jsonwebtoken');

class acessoController
{
    verificaAcesso()
    {
        return((request,response) =>{
            const dados = request.body;
            const acessoCRUD = new AcessoCRUD(db);
            acessoCRUD.verificarAcesso(dados)
                .then((resposta) =>{
                    //token de acesso para deixar rotas privadas
                    const token = jwt.sign(
                        {
                            id: resposta.idUsuario,
                            usuario: resposta.usuario,
                            isAdm: resposta.isAdm
                        }, 
                        process.env.JWT_SECRET, 
                        {expiresIn: '30m'}
                    )
                    console.log("Login efetivado com sucesso!");
                    response.status(200).json({
                        mensagem: "Login efetivado com sucesso!",
                        usuario: 
                            {
                            id: resposta.idUsuario,
                            usuario: resposta.usuario,
                            isAdm: resposta.isAdm
                            },
                        token: token
                    })
                })
                .catch((erro) => {
                    console.error(erro);
                    response.status(401).json({
                        erro: "Usuário ou senha inválidos"
                    });
                });
        });
    }
}

module.exports = acessoController;