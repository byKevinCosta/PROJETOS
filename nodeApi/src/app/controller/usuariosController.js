const UsuariosCRUD = require("../model/usuariosCRUD");

const db = require("../../config/database");

class UsuariosController
{
    insereUsuario()
    {
        return ((request,response)  => {
            let dados = request.body;
            console.log("Dados do novo usuário: ");
            console.log(dados);
            const usuariosCRUD = new UsuariosCRUD(db)
            usuariosCRUD
                .inserirUsuario(dados)
                .then(()=>{
                    console.log("Usuário cadastrado com sucesso!");
                    response.status(200).end();
                })
                .catch((erro) => {
                    console.log(erro);
                    response.status(500).json({
                        erro: "Erro ao inserir usuario no BD!"
                    });
                });
        });
    }
}

module.exports = UsuariosController;