document.addEventListener('DOMContentLoaded', async () => {
    await preencherSelect('item', 'php/solicitacoes/solicitacoes_itens.php', 'id_item');
    await preencherSelect('usuario', 'php/usuario_get.php', 'id_usuario');
    buscar();
});

document.getElementById('enviar').addEventListener('click', () => {
    salvar();
});

document.getElementById('limpar').addEventListener('click', () => {
    limparFormulario();
});

async function preencherSelect(idSelect, url, campoId) {
    const retorno = await fetch(url);
    const resposta = await retorno.json();

    if (resposta.status == 'ok') {
        const select = document.getElementById(idSelect);

        for (const r of resposta.data) {
            const option = document.createElement('option');
            option.value = r[campoId];
            option.textContent = r.nome;
            select.appendChild(option);
        }
    }
}

async function buscar() {
    const retorno = await fetch('php/solicitacoes/solicitacoes_get.php');
    const resposta = await retorno.json();

    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    } else {
        document.getElementById('listaSolicitacoes').innerHTML = `
            <tr id="semSolicitacoes">
                <td colspan="5" class="text-center text-muted-eco py-4">
                    Nenhuma solicitação cadastrada.
                </td>
            </tr>`;
    }
}

function preencherTabela(tabela) {
    let html = '';

    for (const s of tabela) {
        html += `
            <tr>
                <td>${s.item ?? ''}</td>
                <td>${s.solicitante ?? ''}</td>
                <td>${s.local_retirada_sugerido ?? ''}</td>
                <td>
                    <span class="status-badge">${s.status_soli}</span>
                </td>
                <td class="d-flex gap-2">
                    <button type="button" class="icon-btn"
                        onclick="editar(${s.id_solicitacao})">
                        Editar
                    </button>
                    <button type="button" class="icon-btn icon-btn-danger"
                        onclick="excluir(${s.id_solicitacao})">
                        Excluir
                    </button>
                </td>
            </tr>`;
    }

    document.getElementById('listaSolicitacoes').innerHTML = html;
}

async function salvar() {
    if (!document.getElementById('item').value) {
        alert('Selecione um item.');
        return;
    }

    if (!document.getElementById('usuario').value) {
        alert('Selecione o solicitante.');
        return;
    }

    if (!document.getElementById('local').value) {
        alert('Selecione um local.');
        return;
    }

    if (!document.getElementById('status').value) {
        alert('Selecione um status.');
        return;
    }

    const id = document.getElementById('id').value;

    const fd = new FormData();
    fd.append('id_item', document.getElementById('item').value);
    fd.append('id_usuario', document.getElementById('usuario').value);
    fd.append('mensagem', document.getElementById('mensagem').value);
    fd.append('local', document.getElementById('local').value);
    fd.append('status', document.getElementById('status').value);

    let url = 'php/solicitacoes/solicitacoes_novo.php';

    if (id) {
        url = 'php/solicitacoes/solicitacoes_alterar.php?id=' + id;
    }

    const retorno = await fetch(url, {
        method: 'POST',
        body: fd
    });

    const resposta = await retorno.json();

    if (resposta.status == 'ok') {
        alert('SUCESSO: ' + resposta.mensagem);
        limparFormulario();
        buscar();
    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}

async function editar(id) {
    const retorno = await fetch('php/solicitacoes/solicitacoes_get.php?id=' + id);
    const resposta = await retorno.json();

    if (resposta.status == 'ok') {
        const reg = resposta.data[0];

        document.getElementById('id').value = id;
        document.getElementById('item').value = reg.id_item;
        document.getElementById('usuario').value = reg.id_usuario_solicitante;
        document.getElementById('mensagem').value = reg.mensagem ?? '';
        document.getElementById('local').value = reg.local_retirada_sugerido;
        document.getElementById('status').value = reg.status_soli;

        document.getElementById('tituloFormulario').textContent = 'Editar solicitação';

        document.getElementById('formSolicitacao').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}

async function excluir(id) {
    if (!confirm('Deseja realmente excluir esta solicitação?')) {
        return;
    }

    const retorno = await fetch('php/solicitacoes/solicitacoes_excluir.php?id=' + id);
    const resposta = await retorno.json();

    alert(resposta.mensagem);

    if (resposta.status == 'ok') {
        limparFormulario();
        buscar();
    }
}

function limparFormulario() {
    document.getElementById('formSolicitacao').reset();
    document.getElementById('id').value = '';
    document.getElementById('tituloFormulario').textContent = 'Nova solicitação';
}