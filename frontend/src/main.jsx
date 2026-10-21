import React from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Inicio from "./App.jsx";
import Cadastro from "./CADASTRO/Cadastro.jsx";
import Labs from "./LABS/Labs.jsx";
import Login from "./LOGIN/Login.jsx";
import Reservas from "./RESERVAS/Reservas.jsx";
import ProtecaoSessao from "./CONTROLE/ProtecaoSessao.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ProtecaoSessao />

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/Cadastro" element={<Cadastro />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Labs" element={<Labs />} />
                <Route path="/Reservas" element={<Reservas />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);