const bcrypt = require('bcrypt');
const RecursosCRUD = require('./recursosCRUD');

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

    listarUsuarios()
    {
        return new Promise( (resolve,reject) =>{
            const sql = "SELECT * FROM p_usuarios"
            this._db.query(sql, (erro,recordset) => {
                if (erro)
                {
                    console.log(erro);
                    return reject("Erro ao listar usuarios no BD!");
                }
                console.log("Dados dos usuarios listados com sucesso!");
                return resolve(recordset);
            })
        });
    }

    excluirUsuario(id)
    {
        return new Promise( (resolve,reject) =>{
            const request = new this._db.Request();


            request.input('id',this._db.Int,id);
            request.query(`
                            IF ((SELECT COUNT(*) FROM p_usuarios WHERE id=@id)!=1)
                            BEGIN
                                RAISERROR('Usuário não encontrado',15,1)
                                RETURN
                            END
                            DELETE FROM p_login WHERE idUsuario=@id;
                            DELETE FROM p_reserva WHERE idUsuario=@id;
                            DELETE FROM p_historicoLogin WHERE idUsuario=@id;
                            DELETE FROM p_usuarios WHERE id=@id;
                `)
                .then(()=>{
                    console.log("Usuário excluído com sucesso!");
                    return resolve();
                })
                .catch((erro) =>{
                    console.log(erro.message);
                    console.log("Erro ao excluir usuario");
                    return reject(erro.message);
                })
        })
    }

}

module.exports = UsuariosCRUD;