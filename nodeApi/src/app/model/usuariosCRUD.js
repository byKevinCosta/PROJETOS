class UsuariosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    inserirUsuario(usuario)
    {
        return new Promise((resolve,reject) => {
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