
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Inicio from "./App.jsx";
import Cadastro from "./CADASTRO/Cadastro.jsx";
import Labs from "./LABS/Labs.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Inicio />}
                />

                <Route
                    path="/Cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/Labs"
                    element={<Labs />}
                />

            </Routes>
        </BrowserRouter>
    </StrictMode>
);