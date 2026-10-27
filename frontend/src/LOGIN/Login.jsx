import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    async function fazerLogin(event) {
        event.preventDefault();
        setErro("");

        try {
            const resposta = await fetch("http://localhost:8081/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario,
                    senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(dados.erro || dados.mensagem || "Usuário ou senha inválidos.");
                return;
            }

            if (!dados.token) {
                setErro("A API não retornou um token.");
                return;
            }

            // Limpa uma sessão anterior...
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            localStorage.removeItem("expiracaoLogin");

            // Salva os dados da sessão...
            localStorage.setItem("token", dados.token);
            localStorage.setItem("usuario", dados.usuario.usuario);

            // Define a expiração para 30 minutos...
            const expiracao = Date.now() + 30 * 60 * 1000;

            localStorage.setItem(
                "expiracaoLogin",
                String(expiracao)
            );

            if (dados.usuario.isAdm)
            {
                console.log("Admin logou!");
                navigate("/Admin");
            }
            else
            {
                navigate("/Labs");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            setErro("Não foi possível conectar com o servidor.");
        }
    }

    return (
        <div className="pagina-login">
            <h1>SOFTH LABS</h1>
            <h2>Entrar na conta</h2>

            <form onSubmit={fazerLogin}>
                <label htmlFor="usuario">Usuário</label>
                <input
                    id="usuario"
                    type="text"
                    value={usuario}
                    onChange={(event) => setUsuario(event.target.value)}
                    placeholder="Digite seu usuário"
                    required
                />

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Digite sua senha"
                    required
                />

                {erro && <p style={{ color: "red" }}>{erro}</p>}

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
