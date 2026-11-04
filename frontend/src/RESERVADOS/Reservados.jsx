import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Reservados.css';


const token = localStorage.getItem("token");





export default function reservados()
{
    const navigate = useNavigate();
    let [reservas,setReservas] = useState([]);
   /* useEffect(() ={

        
    },[reservas])*/
    async function geraLista(formulario)
    {
        formulario.preventDefault();
        if (!formulario) return;
        const form = new FormData(formulario.currentTarget);
        const dados = Object.fromEntries(form);
        console.log(dados);
        let params = {};

        if(dados.escolhaNome === 'on'){
            params.usuario = dados.nomeUser;
        }

        if(dados.recurso === "nome"){
            params.nome = dados.nomeRec
        }
        if(dados.recurso === "codigo"){
            params.codigo = dados.idRecurso
        }

        if(dados.periodo === "periodo" && dados.dataInicio && dados.dataFim)
        {
            params.inicio = dados.dataInicio;
            params.fim = dados.dataFim;
        }

        if(dados.periodo === "data" && dados.dia)
        {
            params.dia = dados.dia
        }
        console.log(params);
        if( !params.usuario && !params.nome && !params.codigo && !params.periodo && !params.dataInicio && !params.dataFim && !params.dia) 
            {
                setReservas([]);
                return;
            }
        
        const query_string = new URLSearchParams(params).toString();
        const url = `http://localhost:8081/Reservas?${query_string}`;

        console.log(params);
        console.log(url);

        const resposta = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        });
        const dadosReservas = await resposta.json();
        console.log(dadosReservas);
        setReservas(dadosReservas);
    }

    async function listarTodos() {
        const resposta = await fetch("http://localhost:8081/Reservas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
        });
        const dados = await resposta.json();
        console.log(dados);
        setReservas(dados);
        
    }

    function limpar()
    {
        setReservas([]);
    }
    
    async function excluirReserva(idUsuario,idReserva){
        console.log("Reserva id:" + idUsuario + "excluida");
        console.log(idUsuario, idReserva)
        const resposta = await fetch("http://localhost:8081/Reservas", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            id: idUsuario,
            idReserva: idReserva
            })
        }).then(() =>{
            alert(`Reserva de id: ${idReserva} excluída com sucesso!`)
            listarTodos();
        })
        .catch((erro) =>{
            console.error(erro)
        })
        
    }

    function Formulario(){
        return(
            <div className="pagina">
            <h1>Procurar Reservas</h1>
            <div className="opcoes">
                <form onSubmit={geraLista}>
                    <label>
                        <input type="checkbox" id="nomeUsuario" name="escolhaNome"/> <p>Nome do usuário:</p>
                        <input type="text" name="nomeUser"></input>
                    </label>
                    <label>
                        <input type="radio" name="recurso" value="nome"/> <p>Nome do recurso:</p>
                        <input type="text" name="nomeRec"></input>
                    </label>
                    <label>
                        <input type="radio" name="recurso" value="codigo"/> <p>Codigo do recurso:</p>
                        <input type="number" name="idRecurso"></input>
                    </label>
                    <label>
                        <input type="radio" name="periodo" value="periodo"/> <p>Período: </p>
                        <p>Início:</p>
                        <input type="date" id="dataInicio" name="dataInicio"></input> <p>Fim:</p>
                        <input type="date" id="dataFim" name="dataFim"></input>
                    </label>
                    <label>
                        <input type="radio" name="periodo" value="data"/> <p>Data:</p>
                        <input type="date" id="dia" name="dia"></input>
                    </label>
                    <div className="botoes">
                        <button type="reset" onClick={limpar}>Limpar Filtros</button>
                        <button onClick={listarTodos}>Listar Todas</button>
                        <button type="submit">Procurar</button>
                    </div>
                </form>
            </div>
        </div>
        )
    }

    return(
        <>
        <Formulario/>
        <div className="reservas">
        {reservas.map((reserva,index) =>{
            return(
            <div className="cards" key={index}>
                <p>Id Reserva: <span>{reserva.idReserva}</span></p>
                <p>Quem reservou: </p><span>{reserva["Nome do usuario"]}, id Usuario: {reserva.idUsuario}</span>
                <p>Nome do recurso: </p><span>{reserva.nome}, id Recurso: {reserva.codigoRec}</span>
                <p>Data de inicio: </p><span>{reserva.dataInicio}</span>
                <p>Data final da reserva: </p><span>{reserva.dataFim}</span>
                <br></br>
                <button onClick={() => excluirReserva(reserva.idUsuario,reserva.idReserva)}>Excluir reserva</button>
            </div>);
        })}
        </div>
        </>
    )
}