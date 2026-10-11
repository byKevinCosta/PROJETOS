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
            const sql = `SELECT u.nome, r.* from p_reserva r JOIN p_usuarios u ON u.id = r.idUsuario
					WHERE codigoRec = ${idRecurso}  
                        AND (DAY(dataInicio) = DAY('${dia}') or DAY(dataFim) = DAY('${dia}'))`;

            this._db.query(sql,function(erro,recordset){
                if(erro){
                    console.log(erro);
                    return reject("Listar reserva do recurso por dia está com erro!");
                }
                console.log("Listagem de reservas do recurso gerada com sucesso!");
                resolve(recordset); //se não tiver reservas naquele dia, o resultado será [] vazio
            });
        });
    }

    reservarRecurso(idRec,idUsuario,dataInicio,dataFim)
    {
        return new Promise((resolve,reject) =>{
            const sql = `EXEC sp_reservarRecurso ${idRec}, ${idUsuario}, '${dataInicio}', '${dataFim}'`;
            this._db.query(sql,function(erro){
                if(erro){
                    console.log(erro);
                    return reject("Erro ao reservar recurso!");
                }
                console.log("Reserva registrada com sucesso!");
                resolve();
            });
        });
    }

}

module.exports = RecursosCRUD;