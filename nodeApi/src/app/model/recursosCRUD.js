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
                    return reject("Listagem dos laboratorios está com erro!");
                }
                console.log("Listagem dos laboratorios geradas com sucesso!");
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
					WHERE codigoRec = @idRec AND CAST(dataInicio AS DATE) <= CAST(@dia AS DATE) AND CAST(dataFim AS DATE) >= CAST(@dia AS DATE)`;
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

    /*fiz assim para não criar uma rota para cada filtro.
    em dados pode ser colocados os filtros:
    {
        codigo: int, //codigo do recurso
        nome: varchar, //nome do recurso
        usuario: varchar, //nome do usuario (ou parte do nome %LIKE%)
        dia: smalldatetime, //se tiver inicio e fim não pode ter filtro dia e vice versa
        inicio: smalldatetime, //só pode ter inicio se tiver fim e vice e versa
        fim: smalldatetime
    }
    */
    gerarListagemReservaPorFiltros(dados) 
    {
        return new Promise((resolve,reject) => {
            if(dados.dia && dados.inicio || dados.dia && dados.fim || dados.inicio && !dados.fim || !dados.inicio && dados.fim)
            {
                return reject("Não é possível aplicar o filtro nas datas dadas!");
            }

            const request = new this._db.Request();
            let sql = `SELECT u.nome AS 'Nome do usuario', rec.nome, r.* FROM p_reserva r 
                JOIN p_usuarios u ON u.id = r.idUsuario
                JOIN p_recursos rec ON rec.codigo = r.codigoRec`
            let lista = [];

            if(dados.codigo){
                request.input('codigo',this._db.Int,dados.codigo);
                lista.push("r.codigoRec = @codigo");
            }
            if(dados.nome){
                request.input('nome',this._db.VarChar,`%${dados.nome}%`);
                lista.push("rec.nome LIKE @nome");
            }
            if(dados.usuario)
            {
                request.input('usuario',this._db.VarChar,`%${dados.usuario}%`);
                lista.push("u.nome LIKE @usuario")
            }
            if(dados.dia && !dados.inicio && !dados.fim)
            {
                request.input('dia',this._db.SmallDateTime,dados.dia);
                lista.push("CAST(dataInicio AS DATE) <= CAST(@dia AS DATE) AND CAST(dataFim AS DATE) >= CAST(@dia AS DATE)");
            }
            if(!dados.dia && dados.inicio && dados.fim)
            {
                request.input('inicio',this._db.SmallDateTime,dados.inicio);
                request.input('fim',this._db.SmallDateTime,dados.fim);
                lista.push("CAST(dataFim AS DATE) >= CAST(@inicio AS DATE) AND CAST(dataInicio AS DATE) <= CAST(@fim AS DATE)");
            }
            if (lista.length>0)
            {
                sql+= " WHERE "
                for(let i=0; i<lista.length-1;i++)
                {
                    sql+= lista[i] + " AND ";
                }
                sql+= lista[lista.length-1];
            }
            sql+= " ORDER BY u.nome";
            console.log(sql);
            request.query(sql)
                .then((recordset) =>{
                    console.log("Consulta realizada com sucesso!");
                    resolve(recordset);
                })
                .catch((erro)=>{
                    console.error(erro);
                    return reject("Erro ao realizar consulta");
                })
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
                    reject("Erro ao realizar reserva de recurso!");
                });     
        });
    }

    cadastrarRecurso(dados)
    {
        return new Promise((resolve,reject) =>{
            const {nome,capacidade,localizacao,isLab} = dados;
            if (!nome || !capacidade || !localizacao || isLab == undefined)
            {
                return reject("Erro ao cadastrar recurso, dados pendentes");
            }
            const request = new this._db.Request();
            request.input('nome',this._db.VarChar,nome);
            request.input('capacidade',this._db.Int,capacidade);
            request.input('localizacao',this._db.VarChar,localizacao);
            request.input('isLab',this._db.Bit,isLab);
            request.query(`INSERT INTO p_recursos(nome,capacidade,localizacao,isLab)
                                VALUES (@nome,@capacidade,@localizacao,@isLab);
                            INSERT INTO p_statusRec(codigoRec,bloqueado)
                                VALUES ((SELECT codigo FROM p_recursos WHERE nome = @nome),0)`)
                .then(()=>{
                    console.log("Recurso cadastrado com sucesso!");
                    resolve();
                })
                .catch((erro) => {
                    console.error(erro);
                    return reject("Erro ao cadastrar recurso!");
                })

        })
    }

    alterarStatusRec(dados)
    {
        return new Promise((resolve,reject) =>{
            const {status,id} = dados;
            if (status != true && status != false){
                return reject("Status deve ser true/false (bloquear/liberar)");
            }
            if (!id || status == undefined)
            {
                return reject("Erro, dados ausentes!");
            }
            const request = new this._db.Request();
            request.input('id',this._db.Int,id);
            request.input('status',this._db.Bit,status);
            request.query(`UPDATE p_statusRec 
                            SET bloqueado = @status
                                WHERE codigoRec = @id`)
                .then(() =>{
                    console.log(`Status do recurso ${id}, atualizado para: ${status}`);
                    resolve();
                })
                .catch((erro)=>{
                    console.error(erro);
                    return reject("Erro ao atualizar status do recurso");
                })
        })

    }

    excluirRec(id)
    {
        return new Promise((resolve,reject) =>{
            const request = new this._db.Request();
            request.input('id',this._db.Int,id);
            request.query(`DELETE FROM p_statusRec WHERE codigoRec = @id;
                            DELETE FROM p_reserva WHERE codigoRec = @id;
                            DELETE FROM p_recursos WHERE codigo = @id;`)
                    .then(() =>{
                        console.log("Recurso excluído com sucesso!");
                        return resolve();
                    })
                    .catch((erro)=>{
                        console.error(erro);
                        return reject("Erro ao excluir recurso!");
                    })
        })
    }

}

module.exports = RecursosCRUD;

