class UsuariosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    inserirUsuario(usuario)
    {
        return new Promise((resolve,reject) => {
            const sql = `INSERT INTO p_usuarios(cpf,nome,dataNasc,celular,email) 
            VALUES ('${usuario.cpf}','${usuario.nome}','${usuario.dataNasc}','${usuario.celular}','${usuario.email}');
            INSERT INTO p_login(idUsuario,usuario,senha,dataCadastro) 
            VALUES ((SELECT id FROM p_usuarios WHERE cpf = '${usuario.cpf}'),'${usuario.usuario}','${usuario.senha}',GETDATE());`;
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