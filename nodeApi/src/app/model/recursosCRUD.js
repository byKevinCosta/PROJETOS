class RecursosCRUD
{
    constructor(db)
    {
        this._db = db;
    }

    listarSalas()
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

}

module.exports = RecursosCRUD;