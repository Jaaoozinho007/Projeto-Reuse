const KEY_AVALIACOES = 'app_avaliacoes';

function listarAvaliacoes() {
  return JSON.parse(localStorage.getItem(KEY_AVALIACOES) || '[]');
}

function salvarAvaliacoes(lista) {
  localStorage.setItem(KEY_AVALIACOES, JSON.stringify(lista));
}

function seedAvaliacoes() {
  const existentes = listarAvaliacoes();
  if (existentes.length > 0) return;

  const iniciais = [
    {
      id: Date.now(),
      item: 'Monitor LG 19"',
      avaliador: 'Bruna A.',
      avaliado: 'David F.',
      nota: 5,
      comentario: 'Entrega rápida e item como descrito.',
    },
    {
      id: Date.now() + 1,
      item: 'Estante de madeira',
      avaliador: 'David F.',
      avaliado: 'Ana Souza',
      nota: 4,
      comentario: 'Combinou tudo certinho pelo chat.',
    },
  ];

  salvarAvaliacoes(iniciais);
}

function rotuloNota(nota) {
  const rotulos = {
    1: 'Muito ruim',
    2: 'Ruim',
    3: 'Neutro',
    4: 'Bom',
    5: 'Muito bom',
  };
  return rotulos[nota] || '';
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

function renderListaAvaliacoes() {
  const tbody = document.getElementById('corpoTabela');
  const avaliacoes = listarAvaliacoes();

  if (avaliacoes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted-eco py-4">Nenhuma avaliação cadastrada.</td></tr>';
    return;
  }

  tbody.innerHTML = avaliacoes.map((av) => `
    <tr data-id="${av.id}">
      <td>${av.item}</td>
      <td>${av.avaliador}</td>
      <td>${av.avaliado}</td>
      <td class="rating"><span class="fw-semibold">${av.nota}</span> <span class="small text-muted-eco">(${rotuloNota(av.nota)})</span></td>
      <td class="small text-muted-eco">${av.comentario}</td>
      <td class="d-flex gap-2">
        <button type="button" class="icon-btn btn-editar-linha" title="Editar"><i class="bi bi-pencil"></i></button>
        <button type="button" class="icon-btn icon-btn-danger btn-excluir-linha" title="Excluir"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function popularSelects() {
  const avaliacoes = listarAvaliacoes();
  const placeholder = '<option value="" selected disabled>Selecione...</option>';

  const opcoesHTML = avaliacoes.map((av) =>
    `<option value="${av.id}">${av.item} — ${av.avaliador} → ${av.avaliado}</option>`
  ).join('');

  selecionarEditar.innerHTML = placeholder + opcoesHTML;
  selecionarExcluir.innerHTML = placeholder + opcoesHTML;
}

const formCriar = document.getElementById('formCriar');
const formEditar = document.getElementById('formEditar');
const selecionarEditar = document.getElementById('selecionarEditar');
const selecionarExcluir = document.getElementById('selecionarExcluir');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');

let idParaExcluir = null;

formCriar.addEventListener('submit', (e) => {
  e.preventDefault();

  limparErroCampo('criarAvaliador');
  limparErroCampo('criarAvaliado');

  const dados = Object.fromEntries(new FormData(formCriar));
  let temErro = false;

  if (dados.criarAvaliador.trim() === '') {
    mostrarErroCampo('criarAvaliador', 'Avaliador obrigatório.');
    temErro = true;
  }
  if (dados.criarAvaliado.trim() === '') {
    mostrarErroCampo('criarAvaliado', 'Avaliado obrigatório.');
    temErro = true;
  }
  if (temErro) return;

  const nova = {
    id: Date.now(),
    item: dados.criarItem,
    avaliador: dados.criarAvaliador.trim(),
    avaliado: dados.criarAvaliado.trim(),
    nota: Number(dados.criarNota),
    comentario: dados.criarComentario.trim(),
  };

  const lista = listarAvaliacoes();
  lista.push(nova);
  salvarAvaliacoes(lista);

  formCriar.reset();
  renderListaAvaliacoes();
  popularSelects();
  ativarAba('tabListar');
});

function preencherFormEdicao(id) {
  const avaliacao = listarAvaliacoes().find((av) => av.id === id);
  if (!avaliacao) return;

  document.getElementById('editarId').value = avaliacao.id;
  document.getElementById('editarItem').value = avaliacao.item;
  document.getElementById('editarAvaliador').value = avaliacao.avaliador;
  document.getElementById('editarAvaliado').value = avaliacao.avaliado;
  document.getElementById('editarNota').value = avaliacao.nota;
  document.getElementById('editarComentario').value = avaliacao.comentario;
}

selecionarEditar.addEventListener('change', () => {
  preencherFormEdicao(Number(selecionarEditar.value));
});

formEditar.addEventListener('submit', (e) => {
  e.preventDefault();

  limparErroCampo('editarAvaliador');
  limparErroCampo('editarAvaliado');

  const dados = Object.fromEntries(new FormData(formEditar));
  const id = Number(dados.editarId);
  let temErro = false;

  if (dados.editarAvaliador.trim() === '') {
    mostrarErroCampo('editarAvaliador', 'Avaliador obrigatório.');
    temErro = true;
  }
  if (dados.editarAvaliado.trim() === '') {
    mostrarErroCampo('editarAvaliado', 'Avaliado obrigatório.');
    temErro = true;
  }
  if (temErro) return;

  const lista = listarAvaliacoes().map((av) =>
    av.id === id
      ? {
          ...av,
          item: dados.editarItem,
          avaliador: dados.editarAvaliador.trim(),
          avaliado: dados.editarAvaliado.trim(),
          nota: Number(dados.editarNota),
          comentario: dados.editarComentario.trim(),
        }
      : av
  );

  salvarAvaliacoes(lista);
  renderListaAvaliacoes();
  popularSelects();
  formEditar.reset();
  selecionarEditar.value = '';
  ativarAba('tabListar');
});

btnCancelarEdicao.addEventListener('click', () => {
  formEditar.reset();
  selecionarEditar.value = '';
  ativarAba('tabListar');
});

function preencherResumoExclusao(id) {
  const avaliacao = listarAvaliacoes().find((av) => av.id === id);
  if (!avaliacao) return;

  idParaExcluir = avaliacao.id;
  document.getElementById('excluirNomeAvaliacao').textContent = `${avaliacao.avaliador} avaliou ${avaliacao.avaliado}`;
  document.getElementById('excluirNota').textContent = `Nota ${avaliacao.nota} — ${rotuloNota(avaliacao.nota)}`;
}

selecionarExcluir.addEventListener('change', () => {
  preencherResumoExclusao(Number(selecionarExcluir.value));
});

btnConfirmarExclusao.addEventListener('click', () => {
  if (!idParaExcluir) {
    mostrarErroCampo('selecionarExcluir', 'Selecione uma avaliação para excluir.');
    return;
  }
  limparErroCampo('selecionarExcluir');

  const avaliacao = listarAvaliacoes().find((av) => av.id === idParaExcluir);
  if (!avaliacao) return;

  if (confirm(`Excluir a avaliação de ${avaliacao.avaliador} para ${avaliacao.avaliado}?`)) {
    salvarAvaliacoes(listarAvaliacoes().filter((av) => av.id !== idParaExcluir));
    idParaExcluir = null;
    selecionarExcluir.value = '';
    document.getElementById('excluirNomeAvaliacao').textContent = '—';
    document.getElementById('excluirNota').textContent = '—';
    renderListaAvaliacoes();
    popularSelects();
    ativarAba('tabListar');
  }
});

document.getElementById('corpoTabela').addEventListener('click', (e) => {
  const linha = e.target.closest('tr[data-id]');
  if (!linha) return;

  const id = Number(linha.dataset.id);

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

document.addEventListener('DOMContentLoaded', () => {
  seedAvaliacoes();
  renderListaAvaliacoes();
  popularSelects();
});