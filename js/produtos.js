// (C)
const form = document.getElementById("form-criar-item");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("criar-nome").value;
    const desc = document.getElementById("criar-descricao").value;
    const foto = document.getElementById("criar-foto").value;
    const categoria = document.getElementById("criar-categoria").value;
    const estado = document.getElementById("criar-estado").value;
    const tipo = document.getElementById("criar-tipo").value;
    const local = document.getElementById("criar-local").value;
    const status = document.getElementById("criar-status").value;

    const item = {
        nome: nome,
        descricao: desc,
        foto: foto,
        categoria: categoria,
        estado: estado,
        tipo: tipo,
        local: local,
        status: status
    };

    let itens = JSON.parse(localStorage.getItem("itens"));

    // se ainda não tem nada salvo, começa um array vazio
    if (itens === null) {
        itens = [];
    }

    itens.push(item);

    localStorage.setItem("itens", JSON.stringify(itens));

    form.reset();
});


// (R)
function listarItens() {

    const tabela = document.getElementById("tabela-itens-body");

    const registros = JSON.parse(localStorage.getItem("itens"));

    tabela.innerHTML = "";

    if (registros === null || registros.length === 0) {
        tabela.innerHTML = "<tr><td colspan='6' class='text-center'>Nenhum item cadastrado.</td></tr>";
        return;
    }

    let linhas = "";

    for (let i = 0; i < registros.length; i++) {

        const item = registros[i];

        linhas = linhas + "<tr>";
        linhas = linhas + "<td>" + item.nome + "</td>";
        linhas = linhas + "<td>" + item.categoria + "</td>";
        linhas = linhas + "<td>" + item.tipo + "</td>";
        linhas = linhas + "<td>" + item.estado + "</td>";
        linhas = linhas + "<td>" + item.status + "</td>";
        linhas = linhas + "</tr>";
    }

    tabela.innerHTML = linhas;
}
listarItens();


// (U)
const selectEditar = document.getElementById("editar-select-item");
const formEditar = document.getElementById("form-editar-item");

function carregarSelectEditar() {

    const registros = JSON.parse(localStorage.getItem("itens"));

    let opcoes = "<option value='' selected disabled>Selecione...</option>";

    if (registros !== null) {
        for (let i = 0; i < registros.length; i++) {
            opcoes = opcoes + "<option value='" + i + "'>" + registros[i].nome + "</option>";
        }
    }

    selectEditar.innerHTML = opcoes;
}

// Quando escolhe um item pra editar
selectEditar.addEventListener("change", function() {

    const index = selectEditar.value;

    const registros = JSON.parse(localStorage.getItem("itens"));

    const item = registros[index];

    if (!item) {
        return;
    }

    formEditar.classList.remove("d-none");

    document.getElementById("editar-id-item").value = index;
    document.getElementById("editar-nome").value = item.nome;
    document.getElementById("editar-descricao").value = item.descricao;
    document.getElementById("editar-foto").value = item.foto;
    document.getElementById("editar-categoria").value = item.categoria;
    document.getElementById("editar-estado").value = item.estado;
    document.getElementById("editar-tipo").value = item.tipo;
    document.getElementById("editar-local").value = item.local;
    document.getElementById("editar-status").value = item.status;
});

// Salvar alterações
formEditar.addEventListener("submit", function(event) {

    event.preventDefault();

    const index = document.getElementById("editar-id-item").value;

    const registros = JSON.parse(localStorage.getItem("itens"));

    registros[index] = {
        nome: document.getElementById("editar-nome").value,
        descricao: document.getElementById("editar-descricao").value,
        foto: document.getElementById("editar-foto").value,
        categoria: document.getElementById("editar-categoria").value,
        estado: document.getElementById("editar-estado").value,
        tipo: document.getElementById("editar-tipo").value,
        local: document.getElementById("editar-local").value,
        status: document.getElementById("editar-status").value
    };

    localStorage.setItem("itens", JSON.stringify(registros));

    listarItens();
    carregarSelectEditar();

    formEditar.classList.add("d-none");
    selectEditar.value = "";

    alert("Item atualizado com sucesso!");
});

// Botão cancelar
document.getElementById("editar-cancelar-item").addEventListener("click", function() {
    formEditar.classList.add("d-none");
    selectEditar.value = "";
});

carregarSelectEditar();


// (D)
const selectExcluir = document.getElementById("excluir-select-item");
const excluirVazio = document.getElementById("excluir-vazio-item");
const excluirConteudo = document.getElementById("excluir-conteudo-item");
const excluirTitulo = document.getElementById("excluir-titulo-item");
const excluirInfo = document.getElementById("excluir-info-item");
const excluirConfirmar = document.getElementById("excluir-confirmar-item");

function carregarSelectExcluir() {

    const registros = JSON.parse(localStorage.getItem("itens"));

    if (registros === null || registros.length === 0) {
        selectExcluir.innerHTML = "<option value='' selected disabled>Nenhum item cadastrado</option>";
        return;
    }

    let opcoes = "<option value='' selected disabled>Selecione...</option>";

    for (let i = 0; i < registros.length; i++) {
        opcoes = opcoes + "<option value='" + i + "'>" + registros[i].nome + "</option>";
    }

    selectExcluir.innerHTML = opcoes;
}

// Quando escolhe um item pra excluir
selectExcluir.addEventListener("change", function() {

    const index = selectExcluir.value;

    const registros = JSON.parse(localStorage.getItem("itens"));

    const item = registros[index];

    if (!item) {
        return;
    }

    excluirVazio.classList.add("d-none");
    excluirConteudo.classList.remove("d-none");

    excluirTitulo.textContent = item.nome;
    excluirInfo.textContent = item.categoria + " • " + item.tipo + " • " + item.local;
});

// Confirmar exclusão
excluirConfirmar.addEventListener("click", function() {

    const index = selectExcluir.value;

    const registros = JSON.parse(localStorage.getItem("itens"));

    if (!registros[index]) {
        return;
    }

    if (confirm("Excluir esse item?")) {

        registros.splice(index, 1);

        localStorage.setItem("itens", JSON.stringify(registros));

        listarItens();
        carregarSelectEditar();
        carregarSelectExcluir();

        excluirConteudo.classList.add("d-none");
        excluirVazio.classList.remove("d-none");

        selectExcluir.value = "";

        alert("Item excluído com sucesso!");
    }
});

carregarSelectExcluir();