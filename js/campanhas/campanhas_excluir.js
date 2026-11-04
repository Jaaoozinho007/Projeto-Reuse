const excluirSelect    = document.getElementById('excluir-select');
const excluirVazio     = document.getElementById('excluir-vazio');
const excluirConteudo  = document.getElementById('excluir-conteudo');
const excluirTitulo    = document.getElementById('excluir-titulo');
const excluirInfo      = document.getElementById('excluir-info');
const excluirConfirmar = document.getElementById('excluir-confirmar');
 

async function carregarCampanhasExcluir() {
    const registros = await buscarCampanhas();
    preencherSelectCampanhas(
        excluirSelect,
        registros,
        registros.length ? 'Selecione...' : 'Nenhuma campanha cadastrada'
    );
}
 

excluirSelect.addEventListener('change', () => {
    buscarParaExcluir(excluirSelect.value);
});
 
async function buscarParaExcluir(id) {
    const retorno = await fetch(API + 'campanha_get.php?id=' + id);
    const resposta = await retorno.json();
 
    if (resposta.status != 'ok') {
        alert('ERRO: ' + resposta.mensagem);
        return;
    }
 
    const c = resposta.data[0];
    excluirVazio.classList.add('d-none');
    excluirConteudo.classList.remove('d-none');
 
    excluirTitulo.textContent = c.titulo;
    excluirInfo.textContent = `${c.ong} • ${c.categoria_necessaria} • ${c.status_campanha}`;
}
 
// Confirmar exclusão
excluirConfirmar.addEventListener('click', () => {
    excluir(excluirSelect.value);
});
 
async function excluir(id) {
    if (!id) return;
 
    const retorno = await fetch(API + 'campanha_excluir.php?id=' + id);
    const resposta = await retorno.json();
 
    alert(resposta.mensagem);
 
    if (resposta.status == 'ok') {
        excluirConteudo.classList.add('d-none');
        excluirVazio.classList.remove('d-none');
        atualizarTela();
    }
}
 
document.addEventListener('DOMContentLoaded', () => {
    carregarCampanhasExcluir();
});
 