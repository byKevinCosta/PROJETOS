const bcrypt = require('bcrypt');

class UsuariosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    inserirUsuario(dados)
    {
        return new Promise( async (resolve,reject) => {
            const {cpf,nome,dataNasc,celular,email,usuario,senha} = dados;
            const senhaHash = await bcrypt.hash(senha,9); 
            const request = new this._db.Request();
            request.input('cpf',this._db.VarChar,cpf);
            request.input('nome',this._db.VarChar,nome);
            request.input('dataNasc',this._db.VarChar,dataNasc);
            request.input('celular',this._db.VarChar,celular);
            request.input('email',this._db.VarChar,email);
            request.input('usuario',this._db.VarChar,usuario);
            request.input('senha',this._db.VarChar,senhaHash);
            request.execute('sp_criarUsuario')
                .then(() =>{
                    resolve();
                })
                .catch((erro) => {
                    console.error(erro);
                    reject("Erro ao cadastrar usuário");
                })            
        });
    }

}

module.exports = UsuariosCRUD;