
import { useState } from "react";
import "./Cadastro.css";

function App() {

    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [celular, setCelular] = useState("");
    const [email, setEmail] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    async function cadastrarUsuario(event) {

        event.preventDefault();
        
        const dataFormatada = dataNasc.replaceAll("-", "");

        const usuarioNovo = {
            cpf: cpf,
            nome: nome,
            dataNasc: dataFormatada,
            celular: celular,
            email: email,
            usuario: usuario,
            senha: senha
        };

        try {

            const resposta = await fetch(
                "http://localhost:8081/Cadastro",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(usuarioNovo)
                }
            );

            if (resposta.ok) {

                console.log("Usuário cadastrado com sucesso!");

                setCpf("");
                setNome("");
                setDataNasc("");
                setCelular("");
                setEmail("");
                setUsuario("");
                setSenha("");

                window.location.href="http://localhost:5173/Labs" /*alterar para um servidor valido*/

                /*caminho json 
                cadastro
                {
                   "nome":"usuario"
                   "usuario":"usuario"
                   "senha":"senha"
                   "email":"email"
                }
                {
                    "nome":"usuario"
                   "usuario":"usuario"
                   "senha":"senha"
                   "email":"email"
                   "salareservada":"sala1"
                }
                
                
                */


            } else {

                alert("Erro ao cadastrar usuário.");

            }

        } catch (erro) {

            console.error(erro);
            alert("Não foi possível conectar com o servidor.");

        }
    }

    return (
        <div className="container">

            <div className="formulario">

                <h1>SOFTH LABS</h1>

                <p>Preencha os dados para criar sua conta</p>

                <form onSubmit={cadastrarUsuario}>

                    <div className="campo">
                        <label>CPF</label>

                        <input
                            type="text"
                            value={cpf}
                            maxLength={11}
                            onChange={(event) => {
                            const valor = event.target.value;
                            if (valor.length <= 11) {
                                setCpf(valor);
                            }
                        }}
                    />
                    </div>

                    <div className="campo">
                        <label>Nome completo</label>

                        <input
                            type="text"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                        />

                        {nome && !/^[A-Za-zÀ-ÿ\s]+$/.test(nome) && (
                            <p className="erro">
                                O nome deve conter apenas letras e espaços.
                            </p>
                        )}
                    </div>

                    <div className="campo">
                        <label>Data de nascimento</label>

                        <input
                            type="date"
                            value={dataNasc}
                            onChange={(event) => setDataNasc(event.target.value)}
                        />
                    </div>


                <div className="campo">
                    <label>Celular</label>

                <input
                    type="text"

                    value={celular}
                    maxLength={11}
                    onChange={(event) => {
                        const valor = event.target.value.replace(/\D/g, "");
                        setCelular(valor);
                    }}
                />
                </div>

                    <div className="campo">
                        <label>E-mail</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Usuário</label>

                        <input
                            type="text"
                            value={usuario}
                            onChange={(event) => setUsuario(event.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Senha</label>

                        <input
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                        />
                    </div>

                    <button className="botao" type="submit">
                        Criar minha conta
                    </button>

                </form>

            </div>

        </div>
    );
}

export default App;

