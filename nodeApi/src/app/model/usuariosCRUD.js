class UsuariosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    inserirUsuario(usuario)
    {
        return new Promise((resolve,reject) => {
            function simbolosInvalidos(input) {
                // Teste do input para bloquear caracteres especiais
                let regex = /[^a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ@.\- ]/;
                return regex.test(input);
            }
            function simbolosInvalidos2(input) {
                // Teste do input para bloquear caracteres especiais
                let regex = /[^a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/;
                return regex.test(input);
            }
            function simbolosInvalidosCPF(input) {
                // Teste do input para bloquear caracteres especiais
                let regex = /[^0-9]/;
                return regex.test(input);
            }
            if (simbolosInvalidos(usuario.cpf) || simbolosInvalidos(usuario.nome) || 
            simbolosInvalidosCPF(usuario.dataNasc) || simbolosInvalidos(usuario.celular) ||
            simbolosInvalidos(usuario.email) || simbolosInvalidos(usuario.usuario) ||
            simbolosInvalidos(usuario.senha)){
                console.log("Caracteres especiais são proibidos!");
                return reject("Inclusão de novo usuário negada!");
            }
            if (simbolosInvalidos2(usuario.usuario) || simbolosInvalidos2(usuario.senha)){
                console.log("Não é permitido espaços nos campos usuario/senha");
                return reject("Inclusão de novo usuário negada!");
            }
            const sql = `EXEC sp_criarUsuario '${usuario.cpf}','${usuario.nome}',
            '${usuario.dataNasc}','${usuario.celular}','${usuario.email}',
            '${usuario.usuario}','${usuario.senha}'`;

            this._db.query(sql,function(erro){
                if(erro){
                    console.log(erro);
                    return reject("Inclusão de novo usuário está com erro!");
                }
                resolve();
            });  
            
        });
    }

}

module.exports = UsuariosCRUD;