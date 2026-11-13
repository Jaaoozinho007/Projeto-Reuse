
"use strict";

const $ = id => document.getElementById(id);

let csrf = "";
let produtos = [];
let categorias = [];
let metricas = [];

function aviso(texto) {
    const el = $("toast");

    el.textContent = texto;
    el.style.display = "block";

    clearTimeout(aviso.timer);

    aviso.timer = setTimeout(() => {
        el.style.display = "none";
    }, 4500);
}

async function api(url, form = null) {
    const inicio = performance.now();
    let status = 0;

    try {
        if (form && csrf) {
            form.append("csrf", csrf);
        }

        const r = await fetch("php/" + url, {
            method: form ? "POST" : "GET",
            body: form || undefined,
            credentials: "same-origin",
            cache: "no-store"
        });

        status = r.status;

        const resposta = await r.json();

        if (status === 401 && url !== "valida_sessao.php") {
            mostrarLogin();
        }

        return resposta;
    } catch (e) {
        aviso("Não foi possível comunicar com o servidor. Verifique Apache e MySQL.");

        return {
            status: "nok",
            mensagem: "Erro de comunicação.",
            data: []
        };
    } finally {
        const ms = +(performance.now() - inicio).toFixed(1);

        metricas.unshift({
            url,
            ms,
            status,
            hora: new Date().toLocaleTimeString("pt-BR")
        });

        metricas = metricas.slice(0, 100);

        atualizarMetricas();
    }
}

function atualizarMetricas() {
    if (!metricas.length) return;

    $("api-ms").textContent = metricas[0].ms;

    $("max-ms").textContent = Math.max(
        ...metricas.map(m => m.ms)
    ).toFixed(1);

    $("req-count").textContent = metricas.length;

    $("metric-rows").replaceChildren(
        ...metricas.slice(0, 20).map(m => {
            const tr = document.createElement("tr");

            [m.url, m.ms, m.status, m.hora].forEach(v => {
                const td = document.createElement("td");
                td.textContent = v;
                tr.append(td);
            });

            return tr;
        })
    );
}

function mostrarLogin() {
    csrf = "";

    $("login-view").hidden = false;
    $("app-view").hidden = true;
    $("menu").hidden = true;
    $("userbar").hidden = true;
}

async function entrarApp(data) {
    window.me = data.id_usuario;
    csrf = data.csrf;

    $("username").textContent = data.nome;
    $("login-view").hidden = true;
    $("app-view").hidden = false;
    $("menu").hidden = false;
    $("userbar").hidden = false;

    await Promise.all([
        carregarCategorias(),
        carregarProdutos()
    ]);

    aba("explorar");
}

function aba(nome) {
    document.querySelectorAll(".tab").forEach(s => {
        s.hidden = s.id !== nome;
    });

    document.querySelectorAll("[data-tab]").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === nome);
    });

    if (nome === "solicitacoes") {
        carregarSolicitacoes();
        carregarRecebidas();
    }

    if (nome === "avaliar") carregarAvaliaveis();
    if (nome === "perfil") carregarPerfil();
    if (nome === "chat") carregarConversas();
    if (nome === "notificacoes") carregarNotificacoes();
    if (nome === "avaliar-pessoas") carregarPessoasAvaliaveis();
}

function opt(value, text) {
    const o = document.createElement("option");

    o.value = value;
    o.textContent = text;

    return o;
}

async function carregarCategorias() {
    const r = await api("categorias_get.php");

    if (r.status !== "ok") return;

    categorias = r.data;

    $("categoria-anuncio").replaceChildren(
        opt("", "Selecione uma categoria"),
        ...categorias.map(c => opt(c.id_categoria, c.nome))
    );

    $("filtro-categoria").replaceChildren(
        opt("", "Todas as categorias"),
        ...categorias.map(c => opt(c.nome, c.nome))
    );
}

async function carregarProdutos() {
    const r = await api("produtos_get.php");

    if (r.status !== "ok") {
        aviso(r.mensagem);
        return;
    }

    produtos = r.data;
    renderProdutos();
}

function renderProdutos() {
    const termo = $("busca").value.toLocaleLowerCase("pt-BR");
    const cat = $("filtro-categoria").value;
    const estado = $("filtro-estado").value;

    const lista = produtos.filter(p =>
        (p.nome + " " + p.descricao + " " + p.categoria)
            .toLocaleLowerCase("pt-BR")
            .includes(termo) &&
        (!cat || p.categoria === cat) &&
        (!estado || p.estado_conservacao === estado)
    );

    $("count").textContent = lista.length + " itens";

    const area = $("produtos");
    area.replaceChildren();

    if (!lista.length) {
        const e = document.createElement("div");

        e.className = "empty";
        e.textContent = "Nenhum produto encontrado. Experimente outros filtros.";

        area.append(e);
        return;
    }

    for (const p of lista) {
        const card = document.createElement("article");
        card.className = "product";

        const photo = document.createElement("div");
        photo.className = "photo";

        if (
            p.fotos &&
            /^uploads\/[a-f0-9]{32}\.(jpg|png|webp)$/.test(p.fotos)
        ) {
            const img = document.createElement("img");

            img.src = p.fotos;
            img.alt = "Foto do produto " + p.nome;
            img.loading = "lazy";

            photo.append(img);
        } else {
            photo.textContent = "♻";
        }

        card.append(photo);

        const body = document.createElement("div");
        body.className = "product-body";

        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = p.categoria;

        body.append(tag);

        const h = document.createElement("h3");
        h.textContent = p.nome;

        body.append(h);

        for (const t of [
            p.descricao,
            p.estado_conservacao + " • " + p.tipo_negociacao,
            p.localizacao + " • " + p.doador,
            p.media ? "★ " + p.media + "/5" : "Sem avaliações",
            p.status_item
        ]) {
            const el = document.createElement("p");
            el.textContent = t;
            body.append(el);
        }

        if (
            p.status_item === "Disponível" &&
            Number(p.id_usuario_publicador) !== Number(window.me)
        ) {
            const b = document.createElement("button");

            b.className = "primary";
            b.textContent = "Solicitar produto →";

            b.onclick = () => {
                $("request-item").value = p.id_item;
                $("request-name").textContent = p.nome;
                $("request-dialog").showModal();
            };

            body.append(b);
        } else {
            const t = document.createElement("p");

            t.textContent =
                Number(p.id_usuario_publicador) === Number(window.me)
                    ? "Seu anúncio"
                    : "Indisponível";

            body.append(t);
        }

        card.append(body);
        area.append(card);
    }
}

async function carregarSolicitacoes() {
    const r = await api("minhas_solicitacoes.php");
    const area = $("minhas-solicitacoes");

    area.replaceChildren();

    if (r.status !== "ok") {
        aviso(r.mensagem);
        return;
    }

    if (!r.data.length) {
        area.innerHTML = '<div class="empty">Você ainda não fez solicitações.</div>';
        return;
    }

    for (const s of r.data) {
        const row = document.createElement("div");
        row.className = "request-row";

        const left = document.createElement("div");

        const h = document.createElement("h3");
        h.textContent = s.produto;

        const p = document.createElement("p");
        p.textContent = s.mensagem || "Sem mensagem";

        left.append(h, p);

        const badge = document.createElement("span");
        badge.className = "pill";
        badge.textContent = s.status_soli;

        row.append(left, badge);
        area.append(row);
    }
}

async function carregarRecebidas() {
    const area = $("solicitacoes-recebidas");
    area.replaceChildren();

    const r = await api("solicitacoes_recebidas.php");

    if (r.status !== "ok") {
        const erro = document.createElement("div");

        erro.className = "empty";
        erro.textContent = r.mensagem;

        area.append(erro);
        return;
    }

    if (!r.data.length) {
        const vazio = document.createElement("div");

        vazio.className = "empty";
        vazio.textContent =
            "Você ainda não recebeu solicitações para seus anúncios.";

        area.append(vazio);
        return;
    }

    for (const s of r.data) {
        const row = document.createElement("article");
        row.className = "request-row received-row";

        const left = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent =
            s.produto + " · Solicitação #" + s.id_solicitacao;

        const pessoa = document.createElement("p");
        pessoa.textContent = "Solicitante: " + s.solicitante;

        const mensagem = document.createElement("p");
        mensagem.textContent = "Mensagem: " + (s.mensagem || "Sem mensagem");

        const data = document.createElement("p");
        data.className = "hint";
        data.textContent =
            "Data: " + (s.data_solicitacao || "Não informada") +
            " · Retirada: " + (s.local_retirada_sugerido || "A combinar");

        const status = document.createElement("span");
        status.className = "pill";
        status.textContent = s.status_soli;

        left.append(titulo, pessoa, mensagem, data);
        row.append(left, status);
        area.append(row);
    }
}

async function carregarAvaliaveis() {
    const r = await api("avaliacoes_disponiveis.php");

    if (r.status !== "ok") {
        aviso(r.mensagem);
        return;
    }

    $("avaliaveis").replaceChildren(
        opt("", "Selecione o produto"),
        ...r.data.map(s =>
            opt(
                s.id_solicitacao,
                s.nome + " • solicitação #" + s.id_solicitacao
            )
        )
    );

    $("avaliar-vazio").hidden = r.data.length > 0;
    $("avaliacao-form").hidden = r.data.length === 0;
}

function alternarCadastro(cadastro) {
    $("login-form").hidden = cadastro;
    $("register-form").hidden = !cadastro;
}

$("show-register").addEventListener("click", () => alternarCadastro(true));
$("show-login").addEventListener("click", () => alternarCadastro(false));

$("register-form").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const dados = new FormData(form);

    if (dados.get("senha") !== dados.get("confirmar_senha")) {
        aviso("As senhas não coincidem.");
        return;
    }

    const botao = form.querySelector('[type="submit"]');
    botao.disabled = true;

    try {
        const r = await api("cadastro.php", dados);

        aviso(r.mensagem);

        if (r.status === "ok") {
            form.reset();
            alternarCadastro(false);

            $("login-form").elements.email.value = dados.get("email");
            $("login-form").elements.senha.focus();
        }
    } finally {
        botao.disabled = false;
    }
});

$("login-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api("login.php", new FormData(e.currentTarget));

    if (r.status === "ok") {
        await entrarApp(r.data);
        e.currentTarget.reset();
    } else {
        aviso(r.mensagem);
    }
});

$("logout").onclick = async () => {
    const r = await api("logoff.php", new FormData());

    if (r.status === "ok") {
        mostrarLogin();
    } else {
        aviso(r.mensagem);
    }
};

document.querySelectorAll("[data-tab]").forEach(b => {
    b.onclick = () => aba(b.dataset.tab);
});

document.querySelectorAll("[data-go]").forEach(b => {
    b.onclick = () => aba(b.dataset.go);
});

["busca", "filtro-categoria", "filtro-estado"].forEach(id => {
    $(id).addEventListener("input", renderProdutos);
});

$("produto-form").addEventListener("submit", async e => {
    e.preventDefault();

    const f = e.currentTarget;
    const draft = e.submitter?.dataset.draft === "1";
    const data = new FormData(f);

    data.append("rascunho", draft ? "1" : "0");

    if (!draft) {
        for (const name of [
            "nome",
            "descricao",
            "categoria",
            "estado",
            "localizacao"
        ]) {
            if (!String(data.get(name) || "").trim()) {
                aviso("Preencha os campos obrigatórios.");
                f.elements[name].focus();
                return;
            }
        }
    }

    const r = await api("produto_novo.php", data);

    aviso(r.mensagem);

    if (r.status === "ok") {
        f.reset();
        await carregarProdutos();
        aba("explorar");
    }
});

$("atualizar-recebidas").onclick = carregarRecebidas;

$("close-dialog").onclick = () => {
    $("request-dialog").close();
};

$("solicitar-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api(
        "solicitacao_novo.php",
        new FormData(e.currentTarget)
    );

    aviso(r.mensagem);

    if (r.status === "ok") {
        $("request-dialog").close();
        e.currentTarget.reset();
        aba("solicitacoes");
    }
});

$("avaliacao-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api(
        "avaliacao_produto_novo.php",
        new FormData(e.currentTarget)
    );

    aviso(r.mensagem);

    if (r.status === "ok") {
        e.currentTarget.reset();
        await carregarAvaliaveis();
        await carregarProdutos();
    }
});

$("export-metrics").onclick = () => {
    const csv = [
        "endpoint;duracao_ms;http;horario",
        ...metricas.map(m =>
            [m.url, m.ms, m.status, m.hora].join(";")
        )
    ].join("\n");

    const blob = new Blob(["\ufeff" + csv], {
        type: "text/csv;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "reuse-medicoes.csv";
    a.click();

    URL.revokeObjectURL(url);
};

window.addEventListener("load", () => {
    const t = performance.getEntriesByType("navigation")[0];

    if (t) {
        $("load-ms").textContent = t.duration.toFixed(1);
    }
});

(async () => {
    const r = await api("valida_sessao.php");

    if (r.status === "ok") {
        window.me = r.data.id_usuario;
        await entrarApp(r.data);
    } else {
        mostrarLogin();
    }
})();

async function carregarPerfil(id = null) {
    const r = await api(
        "perfil_get.php" + (id ? "?id=" + encodeURIComponent(id) : "")
    );

    if (r.status !== "ok") {
        aviso(r.mensagem);
        return;
    }

    const u = r.data;
    const area = $("perfil-publico");

    area.replaceChildren();

    const h = document.createElement("h3");
    h.textContent = u.nome;
    area.append(h);

    const p = document.createElement("p");

    p.textContent =
        (u.localizacao || "Localização não informada") +
        " • Reputação: " +
        (u.reputacao.media || "sem avaliações");

    area.append(p);

    for (const a of u.avaliacoes) {
        const el = document.createElement("p");

        el.textContent =
            "★ " + a.nota +
            " — " + a.comentario +
            " (" + a.avaliador + ")";

        area.append(el);
    }

    if (!id) {
        for (const key of ["nome", "email", "telefone", "localizacao"]) {
            $("perfil-form").elements[key].value = u[key] || "";
        }
    }
}

$("perfil-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api(
        "perfil_salvar.php",
        new FormData(e.currentTarget)
    );

    aviso(r.mensagem);

    if (r.status === "ok") {
        await carregarPerfil();
    }
});

$("senha-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api(
        "senha_alterar.php",
        new FormData(e.currentTarget)
    );

    aviso(r.mensagem);

    if (r.status === "ok") {
        e.currentTarget.reset();
    }
});

$("denuncia-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api(
        "denuncia_nova.php",
        new FormData(e.currentTarget)
    );

    aviso(r.mensagem);

    if (r.status === "ok") {
        e.currentTarget.reset();
    }
});

async function carregarConversas() {
    const r = await api("chat_get.php");

    if (r.status !== "ok") return;

    const select = $("chat-conversas");
    const old = select.value;

    select.replaceChildren(
        opt("", "Selecione uma conversa"),
        ...r.data.map(x =>
            opt(
                x.id_solicitacao,
                "#" + x.id_solicitacao +
                " • " + x.produto +
                " • " + x.solicitante +
                " / " + x.doador
            )
        )
    );

    if (
        r.data.some(x =>
            String(x.id_solicitacao) === old
        )
    ) {
        select.value = old;
    }

    await carregarMensagens();
}

async function carregarMensagens() {
    const id = $("chat-conversas").value;
    const area = $("chat-mensagens");

    area.replaceChildren();

    if (!id) return;

    const r = await api(
        "chat_get.php?id_solicitacao=" + encodeURIComponent(id)
    );

    if (r.status !== "ok") {
        aviso(r.mensagem);
        return;
    }

    for (const m of r.data) {
        const el = document.createElement("div");

        el.className = "request-row";
        el.textContent =
            m.autor + ": " +
            m.conteudo + " • " +
            m.data_hora;

        area.append(el);
    }
}

$("chat-conversas").addEventListener("change", carregarMensagens);
$("chat-atualizar").onclick = carregarMensagens;

$("chat-form").addEventListener("submit", async e => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    fd.append(
        "id_solicitacao",
        $("chat-conversas").value
    );

    const r = await api("chat_enviar.php", fd);

    aviso(r.mensagem);

    if (r.status === "ok") {
        e.currentTarget.reset();
        await carregarMensagens();
    }
});

async function carregarNotificacoes() {
    const r = await api("notificacoes_get.php");
    const area = $("notificacoes-lista");

    area.replaceChildren();

    if (r.status !== "ok") return;

    if (!r.data.length) {
        area.textContent = "Você ainda não possui notificações.";
        return;
    }

    for (const n of r.data) {
        const row = document.createElement("div");
        row.className = "request-row";

        const txt = document.createElement("p");

        txt.textContent =
            n.tipo_notificacao +
            " • " + n.conteudo_notificacao +
            " • " + n.data_hora;

        row.append(txt);

        if (!Number(n.status_leitura)) {
            const b = document.createElement("button");

            b.className = "outline small";
            b.textContent = "Marcar como lida";

            b.onclick = async () => {
                const fd = new FormData();

                fd.append("id_notificacao", n.id_notificacao);

                const r = await api("notificacao_ler.php", fd);

                aviso(r.mensagem);
                await carregarNotificacoes();
            };

            row.append(b);
        }

        area.append(row);
    }
}

async function carregarPessoasAvaliaveis() {
    const r = await api("avaliacoes_usuario_disponiveis.php");

    if (r.status !== "ok") {
        aviso(r.mensagem);
        return;
    }

    $("pessoas-avaliaveis").replaceChildren(
        opt("", "Selecione a doação"),
        ...r.data.map(x =>
            opt(
                x.id_solicitacao,
                x.produto + " — " + x.pessoa
            )
        )
    );
}

$("pessoa-avaliacao-form").addEventListener("submit", async e => {
    e.preventDefault();

    const r = await api(
        "avaliacao_usuario_nova.php",
        new FormData(e.currentTarget)
    );

    aviso(r.mensagem);

    if (r.status === "ok") {
        e.currentTarget.reset();
        await carregarPessoasAvaliaveis();
    }
});

async function decidirSolicitacao(id, acao) {
    const verbos = {
        aprovar: "aprovar",
        reprovar: "reprovar",
        excluir: "excluir",
        concluir: "concluir a entrega de"
    };

    if (
        !confirm(
            "Confirma " +
            verbos[acao] +
            " a solicitação #" +
            id +
            "?"
        )
    ) {
        return;
    }

    const fd = new FormData();

    fd.append("id_solicitacao", id);
    fd.append("acao", acao);

    const r = await api("solicitacao_decidir.php", fd);

    aviso(r.mensagem);

    if (r.status === "ok") {
        await carregarRecebidas();
        await carregarSolicitacoes();
        await carregarProdutos();
    }
}

const antigaCarregarRecebidas = carregarRecebidas;

carregarRecebidas = async function () {
    await antigaCarregarRecebidas();

    const r = await api("solicitacoes_recebidas.php");

    if (r.status !== "ok") return;

    const area = $("solicitacoes-recebidas");
    const rows = area.querySelectorAll(".request-row");

    r.data.forEach((s, i) => {
        const row = rows[i];

        if (!row) return;

        const actions = document.createElement("div");
        actions.className = "actions";

        if (s.status_soli === "Pendente") {
            for (const [acao, label] of [
                ["aprovar", "Aprovar"],
                ["reprovar", "Reprovar"],
                ["excluir", "Excluir"]
            ]) {
                const b = document.createElement("button");

                b.className = "outline small";
                b.textContent = label;
                b.onclick = () =>
                    decidirSolicitacao(s.id_solicitacao, acao);

                actions.append(b);
            }
        }

        if (s.status_soli === "Aprovada") {
            const b = document.createElement("button");

            b.className = "primary small";
            b.textContent = "Confirmar entrega";
            b.onclick = () =>
                decidirSolicitacao(s.id_solicitacao, "concluir");

            actions.append(b);
        }

        const chat = document.createElement("button");

        chat.className = "outline small";
        chat.textContent = "Conversar";

        chat.onclick = async () => {
            aba("chat");
            await carregarConversas();

            $("chat-conversas").value = s.id_solicitacao;

            await carregarMensagens();
        };

        actions.append(chat);

        const profile = document.createElement("button");

        profile.className = "outline small";
        profile.textContent = "Perfil do solicitante";

        profile.onclick = async () => {
            aba("perfil");
            await carregarPerfil(s.id_solicitante);
        };

        actions.append(profile);
        row.append(actions);
    });
};

const renderOriginal = renderProdutos;

renderProdutos = function () {
    renderOriginal();

    const cards = $("produtos").querySelectorAll(".product");

    const termo = $("busca").value.toLocaleLowerCase("pt-BR");
    const cat = $("filtro-categoria").value;
    const estado = $("filtro-estado").value;

    const lista = produtos.filter(p =>
        (p.nome + " " + p.descricao + " " + p.categoria)
            .toLocaleLowerCase("pt-BR")
            .includes(termo) &&
        (!cat || p.categoria === cat) &&
        (!estado || p.estado_conservacao === estado)
    );

    lista.forEach((p, i) => {
        const card = cards[i];

        if (!card) return;

        const body = card.querySelector(".product-body");

        const a = document.createElement("div");
        a.className = "actions";

        const perfil = document.createElement("button");

        perfil.className = "outline small";
        perfil.textContent = "Ver doador";

        perfil.onclick = async () => {
            aba("perfil");
            await carregarPerfil(p.id_usuario_publicador);
        };

        a.append(perfil);

        const denunciar = document.createElement("button");

        denunciar.className = "outline small";
        denunciar.textContent = "Denunciar";

        denunciar.onclick = () => {
            aba("denuncias");

            $("denuncia-form").elements.tipo.value = "item";
            $("denuncia-form").elements.alvo.value = p.id_item;
        };

        a.append(denunciar);
        body.append(a);
    });
};
