import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LAB.css";

function Labs() {
    const [laboratorios, setLaboratorios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarLaboratorios() {
            const token = localStorage.getItem("token");

            if (!token) {
                setErro("Você precisa fazer login para acessar os laboratórios.");
                setCarregando(false);
                return;
            }

            try {
                const resposta = await fetch(
                    "http://localhost:8081/Lab",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!resposta.ok) {
                    if (resposta.status === 401 || resposta.status === 403) {
                        throw new Error(
                            "Sessão inválida ou expirada. Faça login novamente."
                        );
                    }

                    throw new Error("Erro HTTP: " + resposta.status);
                }

                const dados = await resposta.json();

                console.log("Laboratórios recebidos:", dados);

                const lista = Array.isArray(dados)
                    ? dados
                    : dados.laboratorios;

                if (!Array.isArray(lista)) {
                    throw new Error(
                        "A API não retornou uma lista de laboratórios."
                    );
                }

                setLaboratorios(lista);
            } catch (erro) {
                console.error("Erro ao carregar os Labs:", erro);
                setErro(
                    erro.message || "Não foi possível carregar os laboratórios."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarLaboratorios();
    }, []);

    return (
        <div className="labs-container">
            <div className="labs-conteudo">
                <h1>SOFTH LABS</h1>

                <p className="labs-subtitulo">
                    Lista de Laboratórios
                </p>

                <h2>Laboratórios disponíveis</h2>

                {carregando && (
                    <p className="mensagem">
                        Carregando laboratórios...
                    </p>
                )}

                {erro && (
                    <div>
                        <p className="mensagem erro">{erro}</p>

                        {(erro.includes("login") ||
                            erro.includes("Sessão inválida")) && (
                            <Link to="/Login">
                                Ir para o login
                            </Link>
                        )}
                    </div>
                )}

                {!carregando && !erro && laboratorios.length === 0 && (
                    <p className="mensagem">
                        Nenhum laboratório encontrado.
                    </p>
                )}

                <div className="lista-laboratorios">
                    {laboratorios.map((Lab, indice) => (
                        <div
                            className="card-lab"
                            key={Lab.codigo ?? indice}
                        >
                            <h3>{Lab.nome}</h3>

                            <p>
                                <strong>Código:</strong>{" "}
                                {Lab.codigo}
                            </p>

                            <p>
                                <strong>Capacidade:</strong>{" "}
                                {Lab.capacidade} pessoas
                            </p>

                            <p>
                                <strong>Localização:</strong>{" "}
                                {Lab.localizacao}
                            </p>

                            <p>
                                <strong>É laboratório:</strong>{" "}
                                {Lab.isLab ? "Sim" : "Não"}
                            </p>

                            <Link
                            to="/Reservas"
                            state={{ laboratorio: Lab }}
                            className="botao-reservar"
                            >
                            Reservar
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Labs;