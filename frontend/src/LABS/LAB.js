
const url = "http://177.220.18.108:8081/Lab";

fetch(url)
    .then(response => {

        if (!response.ok) {
            throw new Error("Erro HTTP: " + response.status);
        }

        return response.json();
    })

    .then(Labs => {

        const lista = document.getElementById("Lista-Laboratórios");

        lista.innerHTML = "";

        Labs.forEach(Lab => {

            const card = document.createElement("div");

            card.classList.add("card");

            card.innerHTML = `
                <h3>${Lab.nome}</h3>

                <p>
                    <strong>Código:</strong>
                    ${Lab.codigo}
                </p>

                <p>
                    <strong>Capacidade:</strong>
                    ${Lab.capacidade} pessoas
                </p>

                <p>
                    <strong>Localização:</strong>
                    ${Lab.localizacao}
                </p>

                <p class="status">
                    <strong>É laboratório:</strong>
                    ${Lab.isLab ? "Sim" : "Não"}
                </p>
            `;

            lista.appendChild(card);
        });

    })

    .catch(erro => {

        console.log("Erro ao carregar os Labs:", erro);

        const lista = document.getElementById("Lista-Laboratórios");

        lista.innerHTML = `
            <p>Não foi possível carregar os laboratórios.</p>
        `;
    });

