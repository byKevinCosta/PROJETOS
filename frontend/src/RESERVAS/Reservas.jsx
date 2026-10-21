import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Reservas.css";

const API = "http://177.220.18.108:8081";

const horarios = Array.from({ length: 13 }, (_, indice) => {
    const inicio = 10 + indice;
    const fim = inicio + 1;

    return {
        inicio: `${String(inicio).padStart(2, "0")}:00`,
        fim: `${String(fim).padStart(2, "0")}:00`
    };
});

function criarDataReserva(data, horario = "12:00:00") {
    const [ano, mes, dia] = data.split("-").map(Number);
    const [hora, minuto, segundo] = horario.split(":").map(Number);

    return new Date(ano, mes - 1, dia, hora, minuto, segundo);
}

function obterDataLocal() {
    const agora = new Date();

    return [
        agora.getFullYear(),
        String(agora.getMonth() + 1).padStart(2, "0"),
        String(agora.getDate()).padStart(2, "0")
    ].join("-");
}

function obterUsuarioDoToken(token) {
    try {
        const parte = token.split(".")[1];
        if (!parte) return null;

        const base64 = parte.replace(/-/g, "+").replace(/_/g, "/");
        const payload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((caractere) =>
                    `%${caractere.charCodeAt(0).toString(16).padStart(2, "0")}`
                )
                .join("")
        );

        return JSON.parse(payload);
    } catch {
        return null;
    }
}

function Reservas() {
    const laboratorio = useLocation().state?.laboratorio;

    const [data, setData] = useState("");
    const [reservas, setReservas] = useState([]);
    const [horarioConfirmacao, setHorarioConfirmacao] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!data || !laboratorio) {
            setReservas([]);
            return;
        }

        let cancelado = false;

        async function consultarReservas() {
            const token = localStorage.getItem("token");

            if (!token) {
                setErro("Faça login para consultar os horários.");
                return;
            }

            setCarregando(true);
            setErro("");
            setMensagem("");

            try {
                const resposta = await fetch(`${API}/ReservaNoDia`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        idRec: laboratorio.codigo,
                        dia: criarDataReserva(data)
                    })
                });

                const resultado = await resposta.json().catch(() => ({}));

                if (!resposta.ok) {
                    throw new Error(
                        resultado.erro ||
                        resultado.mensagem ||
                        `Erro ao consultar horários: ${resposta.status}`
                    );
                }

                const lista = Array.isArray(resultado)
                    ? resultado
                    : resultado.reservas;

                if (!Array.isArray(lista)) {
                    throw new Error("A API não retornou uma lista de reservas.");
                }

                if (!cancelado) setReservas(lista);
            } catch (erroConsulta) {
                if (!cancelado) {
                    setErro(erroConsulta.message);
                    setReservas([]);
                }
            } finally {
                if (!cancelado) setCarregando(false);
            }
        }

        consultarReservas();

        return () => {
            cancelado = true;
        };
    }, [data, laboratorio]);

    function horarioOcupado(horario) {
        return reservas.some((reserva) => {
            const inicioReserva = new Date(
                reserva.dataInicio ?? reserva.dataInicioReserva
            );
            const fimReserva = new Date(
                reserva.dataFim ?? reserva.dataFimReserva
            );

            if (
                Number.isNaN(inicioReserva.getTime()) ||
                Number.isNaN(fimReserva.getTime())
            ) {
                return false;
            }

            const inicioBloco = criarDataReserva(data, `${horario.inicio}:00`);
            const fimBloco = criarDataReserva(data, `${horario.fim}:00`);

            return inicioReserva < fimBloco && fimReserva > inicioBloco;
        });
    }

    async function confirmarReserva() {
        if (!horarioConfirmacao) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setErro("Faça login para reservar um horário.");
            return;
        }

        const usuario = obterUsuarioDoToken(token);
        const idUsuario = usuario?.id ?? usuario?.idUsuario;

        if (!idUsuario) {
            setErro("Não foi possível identificar seu usuário. Faça login novamente.");
            return;
        }

        if (horarioOcupado(horarioConfirmacao)) {
            setErro("Esse horário já está ocupado. Escolha outro.");
            setHorarioConfirmacao(null);
            return;
        }

        setEnviando(true);
        setErro("");
        setMensagem("");

        try {
            const resposta = await fetch(`${API}/Reservar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idRec: laboratorio.codigo,
                    idUsuario,
                    dataInicio: criarDataReserva(
                        data,
                        `${horarioConfirmacao.inicio}:00`
                    ),
                    dataFim: criarDataReserva(
                        data,
                        `${horarioConfirmacao.fim}:00`
                    )
                })
            });

            const resultado = await resposta.json().catch(() => ({}));

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro ||
                    resultado.mensagem ||
                    `Erro ao reservar: ${resposta.status}`
                );
            }

            setMensagem(
                `Reserva solicitada para ${horarioConfirmacao.inicio} às ${horarioConfirmacao.fim}.`
            );
            setHorarioConfirmacao(null);

            // Atualiza os horários depois de enviar a reserva.
            const atualizacao = await fetch(`${API}/ReservaNoDia`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idRec: laboratorio.codigo,
                    dia: criarDataReserva(data)
                })
            });

            if (atualizacao.ok) {
                const resultadoAtualizado = await atualizacao.json();
                const lista = Array.isArray(resultadoAtualizado)
                    ? resultadoAtualizado
                    : resultadoAtualizado.reservas;

                if (Array.isArray(lista)) setReservas(lista);
            }
        } catch (erroReserva) {
            setErro(erroReserva.message || "Não foi possível realizar a reserva.");
        } finally {
            setEnviando(false);
        }
    }

    if (!laboratorio) {
        return (
            <main className="reservas-container">
                <header className="reservas-cabecalho">
                    <h1>SOFTH LABS</h1>
                    <p>Reserva de laboratório</p>
                </header>

                <section className="reservas-conteudo">
                    <p>
                        Escolha um laboratório na página de laboratórios
                        para visualizar os horários.
                    </p>
                    <Link to="/Labs" className="botao-voltar">
                        Voltar aos laboratórios
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="reservas-container">
            <header className="reservas-cabecalho">
                <h1>SOFTH LABS</h1>
                <p>Reserva de laboratório</p>
            </header>

            <section className="reservas-conteudo">
                <Link to="/Labs" className="botao-voltar">
                    Voltar aos laboratórios
                </Link>

                <div className="reserva-laboratorio">
                    <h2>{laboratorio.nome}</h2>
                    <p><strong>Código:</strong> {laboratorio.codigo}</p>
                    <p><strong>Capacidade:</strong> {laboratorio.capacidade} pessoas</p>
                    <p><strong>Localização:</strong> {laboratorio.localizacao}</p>
                </div>

                <div className="filtro-data">
                    <label>Selecione a data da reserva</label>

                    <button
                        type="button"
                        className="botao-calendario"
                        onClick={() => document.getElementById("data-reserva").showPicker()}
                    >
                        Escolher data
                    </button>

                    <input
                        id="data-reserva"
                        type="date"
                        value={data}
                        min={obterDataLocal()}
                        onChange={(evento) => {
                            setData(evento.target.value);
                            setHorarioSelecionado("");
                            setMensagem("");
                            setErro("");
                        }}
                        required
                        style={{
                            position: "absolute",
                            width: "1px",
                            height: "1px",
                            opacity: 0,
                            pointerEvents: "none"
                        }}
                    />
                </div>

                <h2>Horários disponíveis</h2>
                <p className="reservas-instrucao">
                    Escolha um bloco de uma hora, entre 10:00 e 23:00.
                </p>

                {carregando && (
                    <p className="reservas-mensagem">Consultando horários...</p>
                )}
                {erro && <p className="reservas-erro">{erro}</p>}
                {mensagem && <p className="reservas-sucesso">{mensagem}</p>}

                {!data && (
                    <p className="reservas-mensagem">
                        Clique no ícone do calendário e escolha uma data.
                    </p>
                )}

                {data && !carregando && !erro && (
                    <div className="lista-horarios">
                        {horarios.map((horario) => {
                            const ocupado = horarioOcupado(horario);

                            return (
                                <button
                                    key={`${horario.inicio}-${horario.fim}`}
                                    type="button"
                                    className={`botao-horario ${
                                        ocupado ? "horario-ocupado" : ""
                                    }`}
                                    disabled={ocupado || enviando}
                                    onClick={() => setHorarioConfirmacao(horario)}
                                >
                                    {ocupado
                                        ? `${horario.inicio} – ${horario.fim} (Ocupado)`
                                        : `${horario.inicio} – ${horario.fim}`}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {horarioConfirmacao && (
                <div className="confirmacao-fundo">
                    <div
                        className="confirmacao-caixa"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-confirmacao"
                    >
                        <h2 id="titulo-confirmacao">Confirmar reserva</h2>
                        <p>
                            Deseja realmente agendar o laboratório{" "}
                            <strong>{laboratorio.nome}</strong> para o dia{" "}
                            <strong>{data}</strong>, das{" "}
                            <strong>{horarioConfirmacao.inicio}</strong> às{" "}
                            <strong>{horarioConfirmacao.fim}</strong>?
                        </p>

                        <div className="confirmacao-botoes">
                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={() => setHorarioConfirmacao(null)}
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="botao-confirmar"
                                onClick={confirmarReserva}
                                disabled={enviando}
                            >
                                {enviando ? "Enviando..." : "Sim, agendar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Reservas;
