import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';


import Inicio from "./App.jsx";
import Cadastro from "./CADASTRO/Cadastro.jsx";
import Labs from "./LABS/Labs.jsx";
import Login from "./LOGIN/Login.jsx";
import Reservas from "./RESERVAS/Reservas.jsx";
import ProtecaoSessao from "./CONTROLE/ProtecaoSessao.jsx";
import Admin from "./ADM/Admin.jsx";




function GeraNav()
{

    const navigate = useNavigate();

    const limparSessao = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("expiracaoLogin");
    navigate("/");
    }

  const token = localStorage.getItem("token");

  if (!token)
  {
    return(
            <nav>
                <Link to='/' className="nomeSite">Soufth Labs</Link>
                <Link to="/Cadastro">Cadastro</Link>
                <Link to="/Login">Login</Link>
            </nav>
    )
  }
  return(
            <nav>
                <Link to='/' className="nomeSite">Soufth Labs</Link>
                <Link to="/Labs">Labs</Link>
                <button className="btSair" onClick={limparSessao}>Sair</button>

            </nav>
  )

}





ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ProtecaoSessao />
                <GeraNav/>

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/Cadastro" element={<Cadastro />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Labs" element={<Labs />} />
                <Route path="/Reservas" element={<Reservas />} />
                <Route path="/Admin" element={<Admin />} />
                <Route path="*" element={<h3><br></br>404 - Página não encontrada!!</h3>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);