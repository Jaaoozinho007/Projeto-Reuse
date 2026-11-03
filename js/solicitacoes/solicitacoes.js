let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

let linhaEditando = null;

function mostrarSolicitacoes() {

  const tbody = document.getElementById("listaSolicitacoes");

  tbody.innerHTML = "";

  if (solicitacoes.length === 0) {

    tbody.innerHTML = `
      <tr id="semSolicitacoes">
        <td colspan="5" class="text-center text-muted-eco py-4">
          Nenhuma solicitação cadastrada.
        </td>
      </tr>
    `;

    return;
  }


  solicitacoes.forEach(function(solicitacao, index) {

    const novaLinha = tbody.insertRow();

    novaLinha.innerHTML = `
      <td>${solicitacao.item}</td>

      <td>${solicitacao.nome}</td>

      <td>${solicitacao.local}</td>

      <td>
        <span class="status-badge">
          ${solicitacao.status}
        </span>
      </td>

      <td class="d-flex gap-2">

        <button
          type="button"
          class="icon-btn"
          onclick="editarSolicitacao(${index})">
          Editar
        </button>

        <button
          type="button"
          class="icon-btn icon-btn-danger"
          onclick="excluirSolicitacao(${index})">
          Excluir
        </button>

      </td>
    `;

  });

}

function salvarLocalStorage() {

  localStorage.setItem(
    "solicitacoes",
    JSON.stringify(solicitacoes)
  );

}

document
  .getElementById("formSolicitacao")
  .addEventListener("submit", function(event) {

    event.preventDefault();


    const item = document.getElementById("item").value;
    const nome = document.getElementById("nome").value;
    const mensagem = document.getElementById("mensagem").value;
    const local = document.getElementById("local").value;
    const status = document.getElementById("status").value;

    if (!item) {
      alert("Selecione um item.");
      return;
    }

    if (!nome.trim()) {
      alert("Digite o nome do solicitante.");
      return;
    }

    if (!local) {
      alert("Selecione um local.");
      return;
    }

    if (!status) {
      alert("Selecione um status.");
      return;
    }

    if (linhaEditando !== null) {

      solicitacoes[linhaEditando] = {
        item: item,
        nome: nome,
        mensagem: mensagem,
        local: local,
        status: status
      };

      linhaEditando = null;

    }

    else {

      solicitacoes.push({
        item: item,
        nome: nome,
        mensagem: mensagem,
        local: local,
        status: status
      });

    }

    salvarLocalStorage();

    mostrarSolicitacoes();

    this.reset();

  });

function editarSolicitacao(index) {

  const solicitacao = solicitacoes[index];


  document.getElementById("item").value = solicitacao.item;

  document.getElementById("nome").value = solicitacao.nome;

  document.getElementById("mensagem").value = solicitacao.mensagem;

  document.getElementById("local").value = solicitacao.local;

  document.getElementById("status").value = solicitacao.status;

  linhaEditando = index;

  document
    .getElementById("formSolicitacao")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}

function excluirSolicitacao(index) {

  if (
    confirm("Deseja realmente excluir esta solicitação?")
  ) {

    solicitacoes.splice(index, 1);

    salvarLocalStorage();

    mostrarSolicitacoes();

  }

}

mostrarSolicitacoes();