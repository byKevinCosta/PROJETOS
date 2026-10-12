const bcrypt = require('bcrypt');
class AcessoCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    verificarAcesso(dados)
    {
        return new Promise(async  (resolve,reject) =>{
            const {usuario,senha} = dados;
            const request = new this._db.Request();
            request.input('usuario',this._db.VarChar,usuario);
            request.query("SELECT senha FROM p_login WHERE usuario = @usuario")
                .then( async (resposta) =>{
                    console.log(senha);
                    const senhaHash = resposta.recordset[0].senha;
                    console.log(senhaHash);
                    const resultado = await bcrypt.compare(senha,senhaHash);
                    if (!resultado) {
                        return reject("Usuário ou senha incorreto");
                    }
                    console.log("Login com sucesso!")
                    resolve();
                })
                .catch((erro) =>{
                    console.error(erro);
                    reject("Erro ao conferir usuario e senha no BD");
                });
        });
    }

}

module.exports = AcessoCRUD;