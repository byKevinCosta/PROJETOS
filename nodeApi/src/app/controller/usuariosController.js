const UsuariosCRUD = require("../model/usuariosCRUD");

const db = require("../../config/database");

function invalidos(input) {
    // Teste do input para bloquear caracteres especiais
    let regex = /[^a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ@.\- ]/;
    return regex.test(input);
}
function invalidos2(input) {
    let regex = /[^a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/;
    return regex.test(input);
}
function invalidosNmr(input) {
    let regex = /[^0-9]/;
    return regex.test(input);
}

class UsuariosController
{
    insereUsuario()
    {
        return ((request,response)  => {
            let dados = request.body;
            //validacoes
            if (dados.cpf.length != 11 || invalidosNmr(dados.cpf)) {
                response.status(400).json({
                erro: "CPF Inválido!"
                }).end();
            }
            if (invalidos(dados.nome) || dados.nome.length <3){
                response.status(400).json({
                erro: "Nome Inválido!"
                }).end();
            }
            if (invalidos(dados.dataNasc)){
                response.status(400).json({
                erro: "Data Inválida!"
                }).end();
            }
            if (dados.celular.length != 11 || invalidosNmr(dados.celular)) {
                response.status(400).json({
                erro: "Celular Inválido!"
                }).end();
            }
            if (dados.email.length < 9 || invalidos(dados.email)) {
                response.status(400).json({
                erro: "Email Inválido!"
                }).end();
            }
            if (dados.usuario.length < 3 || invalidos2(dados.usuario)) {
                response.status(400).json({
                erro: "Usuario Inválido!"
                }).end();
            }
            if (dados.senha.length < 3 || invalidos2(dados.senha)) {
                response.status(400).json({
                erro: "Senha Inválida!"
                }).end();
            }
            //criacao de usuario
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