//Função Criar (C)
const form = document.getElementById("form-criar");
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("criar-titulo").value;
    const desc = document.getElementById("descricao").value;
    const ong = document.getElementById ("ong").value;
    const categoria = document.getElementById("categoria").value;
    const status = document.getElementById ("status").value;

    const camp = {
        titulo: title,
        descricao: desc,
        ong: ong,
        categoria: categoria,
        status: status
    };

    const publicacao = JSON.parse(localStorage.getItem("publicacao"))||[];
    publicacao.push (camp);


    localStorage.setItem("publicacao", JSON.stringify(publicacao));

    form.reset();
});

//Função Ler (R)
function listarCampanhas() {

    const tabela = document.getElementById("tabela-campanhas-body");

    //Pegando registros!
    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    // Limpando a tela;
    tabela.innerHTML = "";

    // Quando não tiver nenhuma campanha...
    if (registros.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Nenhuma campanha cadastrada.
                </td>
            </tr>
        `;

        return;
    }

    // Vai ler todas as campanhas...
    registros.forEach((campanha) => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${campanha.titulo}</td>
            <td>${campanha.ong}</td>
            <td>${campanha.categoria}</td>
            <td>${campanha.status}</td>
            <td>${campanha.descricao}</td>
        `;

        tabela.appendChild(linha);
    });
}
listarCampanhas();

//Função Editar (U)
const SelecionarEditar = document.getElementById("editar-select");
const formEditar = document.getElementById("form-editar");


// Preenche o select com as campanhas existentes
function carregarCampanhasEditar() {

    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    // Limpa as opções atuais
    SelecionarEditar.innerHTML = `
        <option value="" selected disabled>Selecione...</option>
    `;

    registros.forEach((campanha, index) => {

        const option = document.createElement("option");

        // O value será o índice da campanha
        option.value = index;

        option.textContent = campanha.titulo;

        SelecionarEditar.appendChild(option);
    });
}


// Quando selecionar uma campanha
SelecionarEditar.addEventListener("change", function() {

    const index = Number(this.value);

    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    const campanha = registros[index];

    // Se não encontrou a campanha
    if (!campanha) {
        return;
    }

    // Mostra o formulário
    formEditar.classList.remove("d-none");

    // Preenche os campos
    document.getElementById("editar-id").value = index;
    document.getElementById("editar-titulo").value = campanha.titulo;
    document.getElementById("editar-descricao").value = campanha.descricao;
    document.getElementById("editar-ong").value = campanha.ong;
    document.getElementById("editar-categoria").value = campanha.categoria;
    document.getElementById("editar-status").value = campanha.status;
});


// Salvar alterações
formEditar.addEventListener("submit", function(event) {

    event.preventDefault();

    // Qual campanha está sendo editada?
    const index = Number(document.getElementById("editar-id").value);

    // Pega as campanhas existentes
    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    // Atualiza a campanha
    registros[index] = {
        titulo: document.getElementById("editar-titulo").value,
        descricao: document.getElementById("editar-descricao").value,
        ong: document.getElementById("editar-ong").value,
        categoria: document.getElementById("editar-categoria").value,
        status: document.getElementById("editar-status").value
    };

    // Salva novamente
    localStorage.setItem("publicacao", JSON.stringify(registros));

    // Atualiza a tabela
    listarCampanhas();

    // Atualiza o select
    carregarCampanhasEditar();

    // Esconde o formulário
    formEditar.classList.add("d-none");

    // Volta o select para "Selecione..."
    SelecionarEditar.value = "";

    alert("Campanha atualizada com sucesso!");
});


// Botão cancelar
document.getElementById("editar-cancelar").addEventListener("click", function() {

    formEditar.classList.add("d-none");

    SelecionarEditar.value = "";
});


// Carrega as campanhas no select ao abrir a página
carregarCampanhasEditar();

//Excluir (D)

const excluirSelect = document.getElementById("excluir-select");
const excluirVazio = document.getElementById("excluir-vazio");
const excluirConteudo = document.getElementById("excluir-conteudo");
const excluirTitulo = document.getElementById("excluir-titulo");
const excluirInfo = document.getElementById("excluir-info");
const excluirConfirmar = document.getElementById("excluir-confirmar");


// Carrega as campanhas no select
function carregarCampanhasExcluir() {

    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    // Limpa o select
    excluirSelect.innerHTML = `
        <option value="" selected disabled>Selecione...</option>
    `;

    registros.forEach((campanha, index) => {

        const option = document.createElement("option");

        // Guarda o index da campanha
        option.value = index;

        // Texto que aparece no select
        option.textContent = campanha.titulo;

        excluirSelect.appendChild(option);
    });

    // Se não houver campanhas
    if (registros.length === 0) {
        excluirSelect.innerHTML = `
            <option value="" selected disabled>
                Nenhuma campanha cadastrada
            </option>
        `;
    }
}


// Quando selecionar uma campanha
excluirSelect.addEventListener("change", function() {

    const index = Number(this.value);

    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    const campanha = registros[index];

    if (!campanha) {
        return;
    }

    // Esconde a mensagem inicial
    excluirVazio.classList.add("d-none");

    // Mostra o conteúdo
    excluirConteudo.classList.remove("d-none");

    // Preenche os dados
    excluirTitulo.textContent = campanha.titulo;

    excluirInfo.textContent =
        `${campanha.ong} • ${campanha.categoria} • ${campanha.status}`;
});


// Confirmar exclusão
excluirConfirmar.addEventListener("click", function() {

    const index = Number(excluirSelect.value);

    // Pega as campanhas
    const registros = JSON.parse(localStorage.getItem("publicacao")) || [];

    // Verifica se existe uma campanha selecionada
    if (isNaN(index) || !registros[index]) {
        return;
    }

    // Remove a campanha
    registros.splice(index, 1);

    // Salva novamente
    localStorage.setItem("publicacao", JSON.stringify(registros));

    // Atualiza Listar
    listarCampanhas();

    // Atualiza os selects de Editar e Excluir
    carregarCampanhasEditar();
    carregarCampanhasExcluir();

    // Esconde os detalhes
    excluirConteudo.classList.add("d-none");

    // Mostra novamente a mensagem
    excluirVazio.classList.remove("d-none");

    // Volta o select para o início
    excluirSelect.value = "";

    alert("Campanha excluída com sucesso!");
});
// Carrega as campanhas ao abrir a página
carregarCampanhasExcluir();

