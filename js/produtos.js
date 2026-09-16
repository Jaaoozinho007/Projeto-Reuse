// CRUD de Produtos (Itens) - localStorage

const CHAVE = "itens";

const listar = () => JSON.parse(localStorage.getItem(CHAVE) || "[]");

const salvar = (lista) => localStorage.setItem(CHAVE, JSON.stringify(lista));
const seedItens = () => {
    if (listar().length > 0) return;

    salvar([
        {
            id: Date.now(),
            nome: 'Monitor LG 19"',
            descricao: "Monitor funcionando perfeitamente, sem riscos na tela.",
            foto: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400",
            categoria: "Eletrônicos",
            estado: "Seminovo",
            tipo: "Doação",
            local: "Bloco B",
            status: "Disponível"
        },
        {
            id: Date.now() + 1,
            nome: "Estante de madeira",
            descricao: "Estante usada, em bom estado geral.",
            foto: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=400",
            categoria: "Móveis",
            estado: "Usado — bom estado",
            tipo: "Troca",
            local: "Biblioteca central",
            status: "Reservado"
        }
    ]);
};

const tabelaBody = document.getElementById("tabela-itens-body");
const formCriar = document.getElementById("form-criar-item");
const selectEditar = document.getElementById("editar-select-item");
const formEditar = document.getElementById("form-editar-item");
const selectExcluir = document.getElementById("excluir-select-item");
const btnExcluir = document.getElementById("excluir-confirmar-item");

const classeStatus = (status) => {
    if (status === "Disponível") return "status-aceito";
    if (status === "Reservado") return "status-pendente";
    return "status-concluido";
};

/* TROCA DE ABA */

const trocarAba = (idAba) => {
    document.querySelectorAll(".tab-pane").forEach((aba) => {
        aba.classList.remove("show", "active");
    });
    document.getElementById(idAba).classList.add("show", "active");

    document.querySelectorAll(".crud-tabs .nav-link").forEach((link) => {
        link.classList.remove("active");
    });
    document.querySelector(`[data-bs-target="#${idAba}"]`).classList.add("active");
};

/* READ */

const renderLista = () => {
    const itens = listar();

    if (itens.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="6" class="text-muted-eco small">Nenhum item cadastrado.</td></tr>`;
        return;
    }

    tabelaBody.innerHTML = itens.map(item => `
        <tr data-id="${item.id}">
            <td class="d-flex align-items-center gap-2">
                <span class="avatar-sm" style="background-image:url('${item.foto}')"></span>
                ${item.nome}
            </td>
            <td>${item.categoria}</td>
            <td>${item.tipo}</td>
            <td>${item.estado}</td>
            <td><span class="status-badge ${classeStatus(item.status)}">${item.status}</span></td>
            <td class="d-flex gap-2">
                <button class="icon-btn btn-editar-item" title="Editar"><i class="bi bi-pencil"></i></button>
                <button class="icon-btn icon-btn-danger btn-excluir-item" title="Excluir"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join("");
};

const renderSelects = () => {
    const opcoes = listar().map(item => `<option value="${item.id}">${item.nome}</option>`).join("");
    selectEditar.innerHTML = `<option value="" selected disabled>Selecione...</option>${opcoes}`;
    selectExcluir.innerHTML = `<option value="" selected disabled>Selecione...</option>${opcoes}`;
};

const atualizarTela = () => {
    renderLista();
    renderSelects();
};

/* CREATE */

formCriar.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("criar-nome").value.trim();
    if (!nome) return;

    const novoItem = {
        id: Date.now(),
        nome: nome,
        descricao: document.getElementById("criar-descricao").value,
        foto: document.getElementById("criar-foto").value,
        categoria: document.getElementById("criar-categoria").value,
        estado: document.getElementById("criar-estado").value,
        tipo: document.getElementById("criar-tipo").value,
        local: document.getElementById("criar-local").value,
        status: document.getElementById("criar-status").value
    };

    const lista = listar();
    lista.push(novoItem);
    salvar(lista);

    formCriar.reset();
    atualizarTela();
});

/* UPDATE */

const preencherFormEditar = (item) => {
    document.getElementById("editar-id-item").value = item.id;
    document.getElementById("editar-nome").value = item.nome;
    document.getElementById("editar-descricao").value = item.descricao;
    document.getElementById("editar-foto").value = item.foto;
    document.getElementById("editar-categoria").value = item.categoria;
    document.getElementById("editar-estado").value = item.estado;
    document.getElementById("editar-tipo").value = item.tipo;
    document.getElementById("editar-local").value = item.local;
    document.getElementById("editar-status").value = item.status;

    formEditar.classList.remove("d-none");
};

selectEditar.addEventListener("change", () => {
    const id = Number(selectEditar.value);
    const item = listar().find(i => i.id === id);
    if (item) preencherFormEditar(item);
});

formEditar.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = Number(document.getElementById("editar-id-item").value);

    const lista = listar().map(item => item.id === id ? {
        ...item,
        nome: document.getElementById("editar-nome").value,
        descricao: document.getElementById("editar-descricao").value,
        foto: document.getElementById("editar-foto").value,
        categoria: document.getElementById("editar-categoria").value,
        estado: document.getElementById("editar-estado").value,
        tipo: document.getElementById("editar-tipo").value,
        local: document.getElementById("editar-local").value,
        status: document.getElementById("editar-status").value
    } : item);

    salvar(lista);
    atualizarTela();

    formEditar.classList.add("d-none");
    selectEditar.value = "";
});

document.getElementById("editar-cancelar-item").addEventListener("click", () => {
    formEditar.classList.add("d-none");
    selectEditar.value = "";
});

/* DELETE */

const remover = (id) => {
    salvar(listar().filter(item => item.id !== id));
};

btnExcluir.addEventListener("click", () => {
    const id = Number(selectExcluir.value);
    const item = listar().find(i => i.id === id);
    if (!item) return;

    if (confirm(`Excluir "${item.nome}"?`)) {
        remover(id);
        selectExcluir.value = "";
        atualizarTela();
    }
});

tabelaBody.addEventListener("click", (e) => {
    const linha = e.target.closest("[data-id]");
    if (!linha) return;

    const id = Number(linha.dataset.id);

    if (e.target.closest(".btn-editar-item")) {
        const item = listar().find(i => i.id === id);
        if (!item) return;

        trocarAba("tabEditar");
        selectEditar.value = id;
        preencherFormEditar(item);
    }

    if (e.target.closest(".btn-excluir-item")) {
        trocarAba("tabExcluir");
        selectExcluir.value = id;
    }
});

/* Inicialização */

document.addEventListener("DOMContentLoaded", () => {
    seedItens();
    atualizarTela();
});