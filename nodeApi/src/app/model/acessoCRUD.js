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
            if (!usuario || !senha){
                return reject("Usuário e senha são obrigatórios!");
            }
            const request = new this._db.Request();
            request.input('usuario',this._db.VarChar,usuario);
            request.query("SELECT * FROM p_login WHERE usuario = @usuario")
                .then( async (resposta) =>{
                    const senhaHash = resposta.recordset[0].senha;
                    const resultado = await bcrypt.compare(senha,senhaHash);
                    if (!resultado) {
                        return reject("Usuário ou senha incorreto");
                    }
                    console.log("Login com sucesso!")
                    resolve(resposta.recordset[0]);
                })
                .catch((erro) =>{
                    console.error(erro);
                    reject("Erro ao conferir usuario e senha no BD");
                });
        });
    }

}

module.exports = AcessoCRUD;