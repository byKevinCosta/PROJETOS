import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";


const API = "http://localhost:8081";

function Admin() {
  const navigate = useNavigate();


  const token = localStorage.getItem("token");

  // Aba atual: recursos ou usuarios
  const [aba, setAba] = useState("recursos");

  // Listas vindas da API
  const [recursos, setRecursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Erro na tela
  const [erro, setErro] = useState("");

  // Ao abrir a página: se não tem token, vai pro login
  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return;
    }
    buscarRecursos();
  }, []);

  // Header com o token JWT
  function headers() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    };
  }

  // Busca labs e salas
  function buscarRecursos() {
    setErro("");

    Promise.all([
      fetch(API + "/Lab", {
        headers: { Authorization: "Bearer " + token }
      }).then((resposta) => resposta.json()),
    

      fetch(API + "/Salas", {
        headers: { Authorization: "Bearer " + token }
      }).then((resposta) => resposta.json())
    ])
    
      .then(([labs, salas]) => {
        setRecursos([...(labs || []), ...(salas || [])]);
      })
      .catch(() => setErro("Erro ao carregar recursos"));
      
  }

  // Busca usuários (só admin)
  function buscarUsuarios() {
    setErro("");

    fetch(API + "/Usuarios", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Sem permissão");
        return resposta.json();
      })
      .then((dados) => setUsuarios(dados || []))
      .catch(() => setErro("Erro ao carregar usuários"));
  }

  // Remove recurso: DELETE /Rec
  function removerRecurso(id) {
    if (!confirm("Remover recurso " + id + "?")) return;

    fetch(API + "/Rec", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id })
    })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Falha ao remover");
        setRecursos((lista) => lista.filter((item) => item.codigo !== id));
      })
      .catch(() => setErro("Erro ao remover recurso"));
  }

  // Remove usuário: DELETE /Usuarios
  function removerUsuario(id) {
    if (!confirm("Remover usuário " + id + "?")) return;

    fetch(API + "/Usuarios", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id })
    })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Falha ao remover");
        setUsuarios((lista) => lista.filter((item) => item.id !== id));
      })
      .catch(() => setErro("Erro ao remover usuário"));
  }

  function listarUsuarios() {
    setErro("");

    fetch(API + "/Usuarios", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Sem permissão");
        return resposta.json();
      })
      .then((dados) => setUsuarios(dados || []))
      .catch(() => setErro("Erro ao carregar usuários"));
  }

  return (
    <div className="admin">
      <h1>Admin</h1>

      <div className="abas">
        <button
          onClick={() => {
            setAba("recursos");
            buscarRecursos();
          }}
        >
          Recursos
        </button>

        <button
          onClick={() => {
            setAba("usuarios");
            buscarUsuarios();
          }}
        >
          Usuários
        </button>
        

        <button
          onClick={() => {
            setAba("listar");
            listarUsuarios();
          }}
        >
          Listar usuario
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {aba === "recursos" &&
        recursos.map((item) => (
          <div key={item.codigo} className="item">
            <div>
              <b>{item.nome}</b>
              <p>
                Código: {item.codigo} | {item.localizacao}
              </p>
            </div>
            <button onClick={() => removerRecurso(item.codigo)}>
              Remover
            </button>
          </div>
        ))}

      {aba === "listar" &&
        usuarios.map((item) =>  (
          <div key={item.id}className="item">
            <div>
              <b>{item.nome}</b>
              <p>
                ID: {item.id} | {item.email}
              </p>
            </div>
          </div>
        ))}

      {aba === "usuarios" &&
        usuarios.map((item) => (
          <div key={item.id} className="item">
            <div>
              <b>{item.nome}</b>
              <p>
                ID: {item.id} | {item.email}
              </p>
            </div>
            <button onClick={() => removerUsuario(item.id)}>
              Remover
            </button>
          </div>

        ))}
    </div>
  );
}

export default Admin;