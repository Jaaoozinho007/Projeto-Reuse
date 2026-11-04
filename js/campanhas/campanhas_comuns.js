const API = 'php/campanhas/';
 
// Evita injetar HTML vindo do banco (XSS)
function esc(texto) {
    const d = document.createElement('div');
    d.textContent = texto ?? '';
    return d.innerHTML;
}
 
// Busca todas as campanhas no PHP e devolve o array (ou [] se não houver)
async function buscarCampanhas() {
    const retorno = await fetch(API + 'campanha_get.php');
    const resposta = await retorno.json();
    return resposta.status == 'ok' ? resposta.data : [];
}
 
// Preenche um <select> com as campanhas (value = id_campanha)
function preencherSelectCampanhas(sel, registros, textoInicial) {
    sel.innerHTML = `<option value="" selected disabled>${textoInicial}</option>`;
    registros.forEach(c => {
        const op = document.createElement('option');
        op.value = c.id_campanha;
        op.textContent = c.titulo;
        sel.appendChild(op);
    });
}
 
// Preenche os selects de ONG (Criar e Editar) com as instituições do banco
async function carregarOngs() {
    const retorno = await fetch(API + 'instituicao_get.php');
    const resposta = await retorno.json();
 
    const selects = [
        document.getElementById('ong'),
        document.getElementById('editar-ong')
    ];
 
    selects.forEach(sel => {
        sel.innerHTML = '<option value="" selected disabled>Selecione uma ONG</option>';
        if (resposta.status == 'ok') {
            resposta.data.forEach(i => {
                const op = document.createElement('option');
                op.value = i.id_instituicao;   // o value é o ID (FK)
                op.textContent = i.nome;
                sel.appendChild(op);
            });
        }
    });
}
 
// Atualiza tabela + selects de Editar e Excluir (chamada após criar/editar/excluir)
function atualizarTela() {
    listarCampanhas();
    carregarCampanhasEditar();
    carregarCampanhasExcluir();
}
 
document.addEventListener('DOMContentLoaded', () => {
    carregarOngs();
});
 
