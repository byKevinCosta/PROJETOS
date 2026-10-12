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
                    const idUsuario = resposta.recordset[0].idUsuario;
                    try {
                        const request2 = new this._db.Request();
                        request2.input('idUsuario',this._db.Int,idUsuario);
                        request2.query("INSERT INTO p_historicoLogin(idUsuario,data) VALUES (@idUsuario,GETDATE())"); 
                    } catch (erro) {
                        console.error(erro);
                    }
                    console.log("Login e registro no historico de login realizado com sucesso!");
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