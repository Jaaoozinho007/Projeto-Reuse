let listaAvaliacoes = [];
let idParaExcluir = null;

const formCriar = document.getElementById('formCriar');
const formEditar = document.getElementById('formEditar');
const selecionarEditar = document.getElementById('selecionarEditar');
const selecionarExcluir = document.getElementById('selecionarExcluir');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');


function rotuloNota(nota) {
  const rotulos = { 1: 'Muito ruim', 2: 'Ruim', 3: 'Neutro', 4: 'Bom', 5: 'Muito bom' };
  return rotulos[nota] || '';
}

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

function ativarAba(idPainel) {
  const gatilho = document.querySelector(`[data-bs-target="#${idPainel}"]`);
  if (gatilho) bootstrap.Tab.getOrCreateInstance(gatilho).show();
}

function mostrarErroCampo(id, msg) {
  const span = document.getElementById('erro-' + id);
  if (span) span.textContent = msg;
}

function limparErroCampo(id) {
  mostrarErroCampo(id, '');
}


async function carregarUsuarios() {
  const retorno = await fetch('php/usuario_get.php');
  const resposta = await retorno.json();

  const placeholder = '<option value="" selected disabled>Selecione...</option>';
  let opcoes = '';

  if (resposta.status == 'ok') {
    opcoes = resposta.data.map((u) =>
      `<option value="${u.id_usuario}">${esc(u.nome)}</option>`
    ).join('');
  }

  ['criarAvaliador', 'criarAvaliado', 'editarAvaliador', 'editarAvaliado'].forEach((id) => {
    document.getElementById(id).innerHTML = placeholder + opcoes;
  });
}

async function buscar() {
  const retorno = await fetch('php/avaliacoes/avaliacao_get.php');
  const resposta = await retorno.json();

  listaAvaliacoes = resposta.status == 'ok' ? resposta.data : [];
  renderListaAvaliacoes();
  popularSelects();
}

function renderListaAvaliacoes() {
  const tbody = document.getElementById('corpoTabela');

  if (listaAvaliacoes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted-eco py-4">Nenhuma avaliação cadastrada.</td></tr>';
    return;
  }

  tbody.innerHTML = listaAvaliacoes.map((av) => `
    <tr data-id="${av.id_avaliacao}">
      <td>${esc(av.avaliador)}</td>
      <td>${esc(av.avaliado)}</td>
      <td class="rating"><span class="fw-semibold">${av.nota}</span> <span class="small text-muted-eco">(${rotuloNota(Number(av.nota))})</span></td>
      <td class="small text-muted-eco">${esc(av.comentario)}</td>
      <td class="d-flex gap-2">
        <button type="button" class="icon-btn btn-editar-linha" title="Editar"><i class="bi bi-pencil"></i></button>
        <button type="button" class="icon-btn icon-btn-danger btn-excluir-linha" title="Excluir"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function popularSelects() {
  const placeholder = '<option value="" selected disabled>Selecione...</option>';
  const opcoesHTML = listaAvaliacoes.map((av) =>
    `<option value="${av.id_avaliacao}">#${av.id_avaliacao} — ${esc(av.avaliador)} → ${esc(av.avaliado)}</option>`
  ).join('');

  selecionarEditar.innerHTML = placeholder + opcoesHTML;
  selecionarExcluir.innerHTML = placeholder + opcoesHTML;
}


formCriar.addEventListener('submit', (e) => {
  e.preventDefault();
  novo();
});

async function novo() {
  limparErroCampo('criarAvaliador');
  limparErroCampo('criarAvaliado');

  const avaliador = document.getElementById('criarAvaliador').value;
  const avaliado = document.getElementById('criarAvaliado').value;
  let temErro = false;

  if (avaliador === '') { mostrarErroCampo('criarAvaliador', 'Avaliador obrigatório.'); temErro = true; }
  if (avaliado === '') { mostrarErroCampo('criarAvaliado', 'Avaliado obrigatório.'); temErro = true; }
  if (!temErro && avaliador === avaliado) {
    mostrarErroCampo('criarAvaliado', 'Avaliador e avaliado devem ser diferentes.');
    temErro = true;
  }
  if (temErro) return;

  const fd = new FormData();
  fd.append('avaliador', avaliador);
  fd.append('avaliado', avaliado);
  fd.append('nota', document.getElementById('criarNota').value);
  fd.append('comentario', document.getElementById('criarComentario').value.trim());

  const retorno = await fetch('php/avaliacoes/avaliacao_novo.php', {
    method: 'POST',
    body: fd
  });
  const resposta = await retorno.json();

  if (resposta.status == 'ok') {
    alert('SUCESSO: ' + resposta.mensagem);
    formCriar.reset();
    await buscar();
    ativarAba('tabListar');
  } else {
    alert('ERRO: ' + resposta.mensagem);
  }
}

async function preencherFormEdicao(id) {
  const retorno = await fetch('php/avaliacoes/avaliacao_get.php?id=' + id);
  const resposta = await retorno.json();

  if (resposta.status == 'ok') {
    const reg = resposta.data[0];
    document.getElementById('editarId').value = reg.id_avaliacao;
    document.getElementById('editarAvaliador').value = reg.id_usuario_avaliador;
    document.getElementById('editarAvaliado').value = reg.id_usuario_avaliado;
    document.getElementById('editarNota').value = reg.nota;
    document.getElementById('editarComentario').value = reg.comentario ?? '';
  } else {
    alert('ERRO: ' + resposta.mensagem);
  }
}

selecionarEditar.addEventListener('change', () => {
  preencherFormEdicao(selecionarEditar.value);
});

formEditar.addEventListener('submit', (e) => {
  e.preventDefault();
  alterar();
});

async function alterar() {
  limparErroCampo('editarAvaliador');
  limparErroCampo('editarAvaliado');

  const id = document.getElementById('editarId').value;
  const avaliador = document.getElementById('editarAvaliador').value;
  const avaliado = document.getElementById('editarAvaliado').value;
  let temErro = false;

  if (id === '') { alert('Selecione uma avaliação para editar.'); return; }
  if (avaliador === '') { mostrarErroCampo('editarAvaliador', 'Avaliador obrigatório.'); temErro = true; }
  if (avaliado === '') { mostrarErroCampo('editarAvaliado', 'Avaliado obrigatório.'); temErro = true; }
  if (!temErro && avaliador === avaliado) {
    mostrarErroCampo('editarAvaliado', 'Avaliador e avaliado devem ser diferentes.');
    temErro = true;
  }
  if (temErro) return;

  const fd = new FormData();
  fd.append('avaliador', avaliador);
  fd.append('avaliado', avaliado);
  fd.append('nota', document.getElementById('editarNota').value);
  fd.append('comentario', document.getElementById('editarComentario').value.trim());

  const retorno = await fetch('php/avaliacoes/avaliacao_alterar.php?id=' + id, {
    method: 'POST',
    body: fd
  });
  const resposta = await retorno.json();

  if (resposta.status == 'ok') {
    alert('SUCESSO: ' + resposta.mensagem);
    formEditar.reset();
    selecionarEditar.value = '';
    await buscar();
    ativarAba('tabListar');
  } else {
    alert('ERRO: ' + resposta.mensagem);
  }
}

btnCancelarEdicao.addEventListener('click', () => {
  formEditar.reset();
  selecionarEditar.value = '';
  ativarAba('tabListar');
});

function preencherResumoExclusao(id) {
  const avaliacao = listaAvaliacoes.find((av) => Number(av.id_avaliacao) === Number(id));
  if (!avaliacao) return;

  idParaExcluir = avaliacao.id_avaliacao;
  document.getElementById('excluirNomeAvaliacao').textContent = `${avaliacao.avaliador} avaliou ${avaliacao.avaliado}`;
  document.getElementById('excluirNota').textContent = `Nota ${avaliacao.nota} — ${rotuloNota(Number(avaliacao.nota))}`;
}

selecionarExcluir.addEventListener('change', () => {
  preencherResumoExclusao(selecionarExcluir.value);
});

btnConfirmarExclusao.addEventListener('click', () => {
  excluir();
});

async function excluir() {
  if (!idParaExcluir) {
    mostrarErroCampo('selecionarExcluir', 'Selecione uma avaliação para excluir.');
    return;
  }
  limparErroCampo('selecionarExcluir');

  const avaliacao = listaAvaliacoes.find((av) => Number(av.id_avaliacao) === Number(idParaExcluir));
  if (!avaliacao) return;

  if (!confirm(`Excluir a avaliação de ${avaliacao.avaliador} para ${avaliacao.avaliado}?`)) return;

  const retorno = await fetch('php/avaliacoes/avaliacao_excluir.php?id=' + idParaExcluir);
  const resposta = await retorno.json();

  alert(resposta.mensagem);

  if (resposta.status == 'ok') {
    idParaExcluir = null;
    selecionarExcluir.value = '';
    document.getElementById('excluirNomeAvaliacao').textContent = '—';
    document.getElementById('excluirNota').textContent = '—';
    await buscar();
    ativarAba('tabListar');
  }
}

document.getElementById('corpoTabela').addEventListener('click', (e) => {
  const linha = e.target.closest('tr[data-id]');
  if (!linha) return;

  const id = linha.dataset.id;

  if (e.target.closest('.btn-editar-linha')) {
    selecionarEditar.value = id;
    preencherFormEdicao(id);
    ativarAba('tabEditar');
  }

  if (e.target.closest('.btn-excluir-linha')) {
    selecionarExcluir.value = id;
    preencherResumoExclusao(id);
    ativarAba('tabExcluir');
  }
});

document.addEventListener('DOMContentLoaded', async () => {

  await carregarUsuarios();
  buscar();
});