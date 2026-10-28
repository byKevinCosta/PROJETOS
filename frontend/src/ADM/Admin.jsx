import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "http://localhost:8081";

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [aba, setAba] = useState("recursos");
  const [recursos, setRecursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return;
    }
    const payload = jwtDecode(token);
    if(!payload.isAdm)
    {
      navigate("/Login");
      return;
    }
    buscarRecursos();
  }, []);

  function headers() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    };
  }

  // Busca labs, salas E injeta o status de bloqueio de cada um
  function buscarRecursos() {
    setErro("");

    Promise.all([
      fetch(API + "/Lab", { headers: { Authorization: "Bearer " + token } }).then((r) => r.json())
    ])
      .then(async ([labs, salas]) => {
        const listaMisturada = [...(labs || []), ...(salas || [])];

        // Para cada recurso, fazemos uma requisição em paralelo para descobrir se está bloqueado
        const listaComStatus = await Promise.all(
          listaMisturada.map(async (item) => {
            try {
              const resStatus = await fetch(API + "/StatusRec", {
                method: "POST",
                headers: headers(),
                body: JSON.stringify({ id: item.codigo })
              });
              const dadosStatus = await resStatus.json();
              return { ...item, bloqueado: dadosStatus.bloqueado }; // Injeta o true/false no objeto
            } catch {
              return { ...item, bloqueado: false }; // Fallback caso a API de status falhe
            }
          })
        );

        setRecursos(listaComStatus);
      })
      .catch(() => setErro("Erro ao carregar recursos"));
  }

  function buscarUsuarios() {
    setErro("");
    fetch(API + "/Usuarios", { headers: { Authorization: "Bearer " + token } })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Sem permissão");
        return resposta.json();
      })
      .then((dados) => setUsuarios(dados || []))
      .catch(() => setErro("Erro ao carregar usuários"));
  }

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

  // Altera o status e atualiza o estado local para mudar o texto do botão na hora
  function bloqRecurso(id, status) {
    const acao = status === true ? "Bloquear" : "Desbloquear";
    if (!confirm(`${acao} recurso ${id}?`)) return;

    fetch(API + "/AlterarStatusRec", {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ id, status })
    })
      .then((resposta) => {
        if (!resposta.ok) throw new Error("Falha ao alterar status");
        
        // Atualiza apenas o recurso modificado na lista do estado
        setRecursos((lista) =>
          lista.map((item) =>
            item.codigo === id ? { ...item, bloqueado: status === true } : item
          )
        );
      })
      .catch(() => setErro("Erro ao alterar status do recurso"));
  }

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

  return (
    <div className="admin">
      <h1>Admin</h1>

      <div className="abas">
        <button onClick={() => { setAba("recursos"); buscarRecursos(); }}>
          Recursos
        </button>
        <button onClick={() => { setAba("usuarios"); buscarUsuarios(); }}>
          Usuários
        </button>
        <button onClick={() => { setAba("listar"); buscarUsuarios(); }}>
          Listar usuário
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {aba === "recursos" &&
        recursos.map((item) => (
          <div key={item.codigo} className="item">
            <div>
              <b>{item.nome}</b>
              <p>Código: {item.codigo} | {item.localizacao}</p>
            </div>
            <div className="acoes-botoes">
              <button onClick={() => removerRecurso(item.codigo)}>
                Remover
              </button>

              {item.bloqueado ? (
                <button onClick={() => bloqRecurso(item.codigo, false)}>
                  Desbloquear
                </button>
              ) : (
                <button onClick={() => bloqRecurso(item.codigo, true)}>
                  Bloquear
                </button>
              )}
            </div>
          </div>
        ))}

      {aba === "listar" &&
        usuarios.map((item) => (
          <div key={item.id} className="item">
            <div>
              <b>{item.nome}</b>
              <p>ID: {item.id} | {item.email}</p>
            </div>
          </div>
        ))}

      {aba === "usuarios" &&
        usuarios.map((item) => (
          <div key={item.id} className="item">
            <div>
              <b>{item.nome}</b>
              <p>ID: {item.id} | {item.email}</p>
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
