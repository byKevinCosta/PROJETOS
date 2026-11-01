import { useState } from "react";
import { useNavigate } from "react-router-dom";

function geraLista(opcao)
{
    if (opcao == "todas"){
       return (<h1>ok</h1>) 
    }
}

export default function reservados()
{
    const [opcao,setOpcao] = useState("todas");
    const mudaOpcao = (event) =>{
        setOpcao(event.target.value);
    };
    return(
        <div>
            <select id="filtro" onChange={mudaOpcao}>
                <option value="todas">Todas</option>
                <option value="usuario">Usuario</option>
                <option value="recursos">Recurso</option>
                <option vale="periodo">Período</option>
            </select>
        </div>
    )
}