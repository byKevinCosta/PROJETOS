import { useEffect, useState } from "react";
import "./LAB.css";

function Labs() {

    const [laboratorios, setLaboratorios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {

        fetch("http://177.220.18.108:8081/Lab")

            .then(response => {

                if (!response.ok) {
                    throw new Error("Erro HTTP: " + response.status);
                }

                return response.json();
            })

            .then(dados => {

                console.log("Laboratórios recebidos:", dados);

                setLaboratorios(dados);
                setCarregando(false);

            })

            .catch(erro => {

                console.log("Erro ao carregar os Labs:", erro);

                setErro("Não foi possível carregar os laboratórios.");

                setCarregando(false);

            });

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
                    <p className="mensagem erro">
                        {erro}
                    </p>
                )}

                <div className="lista-laboratorios">

                    {laboratorios.map(Lab => (

                        <div
                            className="card-lab"
                            key={Lab.codigo}
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

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Labs;