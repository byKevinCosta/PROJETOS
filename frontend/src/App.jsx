
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
                    <span className="etiqueta">
                        BEM-VINDO
                    </span>

                    <h1>
                        Sua próxima ideia começa aqui.
                    </h1>

                    <p>
                        Explore novas possibilidades com a
                        Soufth Labs, uma plataforma dedicada
                        à tecnologia e à proteção de dados.
                    </p>

                    <div className="botoes">
                        <Link
                            to="/Cadastro"
                            className="botao-principal"
                        >
                            Começar agora
                        </Link>

                        <button
                            type="button"
                            className="botao-secundario"
                            onClick={() => setModalAberto(true)}
                        >
                            Saiba mais
                        </button>
                    </div>
                </div>

                <div className="cartao">

                    <h2>PROTEÇÃO</h2>

                    <p>
                        Nosso site prioriza a segurança e a proteção
                        dos dados armazenados, adotando medidas para
                        prevenir acessos não autorizados e proteger
                        suas informações contra possíveis ameaças.
                    </p>
                </div>

            </main>

            {modalAberto && (
                <div
                    className="modal-fundo"
                    onClick={() => setModalAberto(false)}
                >
                    <div
                        className="modal-janela"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-fechar"
                            onClick={() => setModalAberto(false)}
                            aria-label="Fechar janela"
                        >
                            ×
                        </button>

                        <h2 id="titulo-modal">
                            Sobre:
                        </h2>

                        <p className="modal-descricao">
                            Soufth Labs tem como principal objetivo oferecer uma solução
                            estratégica para o gerenciamento e a reserva de laboratórios,
                            facilitando o acesso, a organização e o agendamento dos espaços
                            disponíveis.
                        </p>
                        <div className="modal-informacao">
                            <h3>Segurança e proteção</h3>
                            <p>
                                Buscamos proteger os dados armazenados
                                e reduzir os riscos de acessos não
                                autorizados às informações.
                            </p>
                                                    </div>
                            <div className="modal-informacao">
                                <h3>Reserva de laboratórios</h3>
                                <p>
                                    Oferecemos uma plataforma para facilitar o agendamento
                                    de laboratórios, permitindo consultar os espaços disponíveis
                                    e organizar as reservas de forma prática e eficiente.
                                </p>
                            </div>

                        <div className="modal-informacao">
                            <h3>Contatos</h3>
                            <p>
                                soufthlabs@gmail.com
                            </p>
                        </div>

                        <button
                            type="button"
                            className="modal-botao"
                            onClick={() => setModalAberto(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default App;