class RecursosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    geraListagemDeSalas()
    {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM dbo.p_recursos WHERE isLab=0";

            this._db.query(sql,function(erro,recordset){
                if(erro){
                    console.log(erro);
                    return reject("Listagem da salas está com erro!");
                }
                console.log("Listagem das salas geradas com sucesso!");
                resolve(recordset);
            });  
            
        });
    }

    geraListagemDeLaboratorios()
    {
        return new Promise((resolve,reject) => {
            const sql = "SELECT * FROM dbo.p_recursos WHERE isLab=1";

            this._db.query(sql,function(erro,recordset){
                if(erro){
                    console.log(erro);
                    return reject("Listagem da laboratorios está com erro!");
                }
                console.log("Listagem das laboratorios geradas com sucesso!");
                resolve(recordset);
            });  
            
        });
    }

    gerarListagemReservasDoRecursoNoDia(idRecurso,dia)
    {
        return new Promise((resolve,reject) => {
            const request = new this._db.Request();
            request.input('idRec',this._db.Int,idRecurso);
            request.input('dia',this._db.SmallDateTime,dia);
            const sql = `SELECT u.nome, r.* from p_reserva r JOIN p_usuarios u ON u.id = r.idUsuario
					WHERE codigoRec = @idRec 
                        AND (DAY(dataInicio) = DAY(@dia) or DAY(dataFim) = DAY(@dia))`;

            request.query(sql)
                .then((recordset) =>{
                    console.log("Listagem de reservas do recurso gerada com sucesso!");
                    resolve(recordset); //se não tiver reservas naquele dia, o resultado será [] vazio
                })
                .catch((erro) => {
                    console.log(erro);
                    return reject("Listar reserva do recurso por dia está com erro!");
                });
        });
    }

    reservarRecurso(idRec,idUsuario,dataInicio,dataFim)
    {
        return new Promise((resolve,reject) =>{
            //usei request para evitar sql injection
            const request = new this._db.Request();
            request.input('idRec',this._db.Int, idRec);
            request.input('idUsuario',this._db.Int, idUsuario);
            request.input('dataInicio',this._db.SmallDateTime, dataInicio);
            request.input('dataFim',this._db.SmallDateTime, dataFim);
            request.execute('sp_reservarRecurso')
                .then(() => {
                    console.log("Reserva registrada com sucesso!");
                    resolve();
                })
                .catch((erro) => {
                    console.error(erro);
                    reject(erro.message);
                });     
        });
    }

}

module.exports = RecursosCRUD;