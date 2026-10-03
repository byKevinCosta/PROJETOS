class UsuariosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    inserirUsuario(usuario)
    {
        return new Promise((resolve,reject) => {
            //não concatenei os dados diretamente na variavel sql para evitar sql injection
            const sql = `INSERT INTO p_usuarios(cpf,nome,dataNasc,celular,email) 
            VALUES ('?','?','?','?','?');
            INSERT INTO p_login(idUsuario,usuario,senha,dataCadastro) 
            VALUES ((SELECT id FROM p_usuarios WHERE cpf = '?'),'?','?',GETDATE())`;
            const dados = [
                    usuario.cpf,
                    usuario.nome,
                    usuario.dataNasc,
                    usuario.celular,
                    usuario.email,
                    usuario.cpf,
                    usuario.usuario,
                    usuario.senha];
            this._db.query(sql,dados,function(erro){
                if(erro){
                    console.log(erro);
                    return reject("Inclusão de novo usuário está com erro!");
                }
                resolve()
            });  
            
        });
    }

}