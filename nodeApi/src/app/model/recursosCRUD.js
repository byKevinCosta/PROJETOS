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

    listarReservasDoRecursoPorDia(idRecurso,dia)
    {
        return new Promise((resolve,reject) => {
            const sql = `SELECT * FROM p_reserva WHERE ${idRecurso} = codigoRec 
            AND (DAY(${dia})  = DAY(dataInicio) or DAY(${dia}) = DAY(dataFim))`;

            this.db.query(sql,function(erro,recordset){
                if(erro){
                    console.log(erro);
                    return reject("Listar reserva do recurso por dia está com erro!");
                }
                console.log("Listagem de reservas do recurso gerada com sucesso!");
                resolve(recordset); //se não tiver reservas naquele dia, o resultado será [] vazio
            });
        });
    }

}

module.exports = RecursosCRUD;