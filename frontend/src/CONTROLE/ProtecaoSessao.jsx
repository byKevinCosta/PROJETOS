
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function limparSessao() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("expiracaoLogin");
}

function ProtecaoSessao() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        function verificarSessao() {
            const token = localStorage.getItem("token");
            const expiracao = Number(
                localStorage.getItem("expiracaoLogin")
            );

            // Se não estiver logado, não precisa limpar a sessão
            if (!token) {
                return;
            }

            // Se a sessão estiver inválida ou tiver expirado
            if (!expiracao || Date.now() >= expiracao) {
                limparSessao();

                if (window.location.pathname !== "/Login") {
                    navigate("/Login", { replace: true });
                }
            }
        }

        verificarSessao();

        // Verifica periodicamente se a sessão expirou
        const intervalo = setInterval(verificarSessao, 1000);

        // Verifica também ao retornar para a aba
        window.addEventListener("focus", verificarSessao);

        return () => {
            clearInterval(intervalo);
            window.removeEventListener("focus", verificarSessao);
        };
    }, [location.pathname, navigate]);

    return null;
}

export default ProtecaoSessao;
