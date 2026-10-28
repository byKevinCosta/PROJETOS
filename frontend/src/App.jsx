
import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
    const [modalAberto, setModalAberto] = useState(false);

    return (
        <div className="pagina-inicial">

            <header className="cabecalho">
                <h2 className="logo">Soufth Labs</h2>

                <div className="acoes">
                    <Link to="/Cadastro" className="botao-cadastrar">
                        Cadastrar
                    </Link>

                    <Link to="/Login" className="botao-login">
                        Login
                    </Link>
                </div>
            </header>

            <main id="inicio" className="conteudo">

                <div className="apresentacao">

                    <h1>
                        Souft labs reserva de laboratorio.
                    </h1>


                    <div className="botoes">
                        <Link
                            to="/Cadastro"
                            className="botao-principal"
                        >
                            Começar agora
                        </Link>

                    </div>
                </div>


            </main>
        </div>
    );
}

export default App;