const selectEditar = document.getElementById('editar-select');
const formEditar   = document.getElementById('form-editar');
 
// Preenche o select com as campanhas existentes
async function carregarCampanhasEditar() {
    const registros = await buscarCampanhas();
    preencherSelectCampanhas(selectEditar, registros, 'Selecione...');
}
 

selectEditar.addEventListener('change', () => {
    buscarParaEditar(selectEditar.value);
});
 
async function buscarParaEditar(id) {
    const retorno = await fetch(API + 'campanha_get.php?id=' + id);
    const resposta = await retorno.json();
 
    if (resposta.status != 'ok') {
        alert('ERRO: ' + resposta.mensagem);
        return;
    }
 
    const c = resposta.data[0];
    formEditar.classList.remove('d-none');
 
    document.getElementById('editar-id').value        = c.id_campanha;
    document.getElementById('editar-titulo').value    = c.titulo;
    document.getElementById('editar-descricao').value = c.descricao;
    document.getElementById('editar-ong').value       = c.id_instituicao_publicante;
    document.getElementById('editar-categoria').value = c.categoria_necessaria;
    document.getElementById('editar-status').value    = c.status_campanha;
    document.getElementById('editar-meta').value      = c.meta ?? '';
}
 

formEditar.addEventListener('submit', (event) => {
    event.preventDefault();
    alterar();
});
 
async function alterar() {
    const id = document.getElementById('editar-id').value;
 
    const fd = new FormData();
    fd.append('titulo',         document.getElementById('editar-titulo').value);
    fd.append('descricao',      document.getElementById('editar-descricao').value);
    fd.append('id_instituicao', document.getElementById('editar-ong').value);
    fd.append('categoria',      document.getElementById('editar-categoria').value);
    fd.append('status',         document.getElementById('editar-status').value);
    fd.append('meta',           document.getElementById('editar-meta').value);
 
    const retorno = await fetch(API + 'campanha_alterar.php?id=' + id, {
        method: 'POST',
        body: fd
    });
    const resposta = await retorno.json();
 
    if (resposta.status == 'ok') {
        alert('SUCESSO: ' + resposta.mensagem);
        formEditar.classList.add('d-none');
        atualizarTela();
    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}
 
// Botão cancelar
document.getElementById('editar-cancelar').addEventListener('click', () => {
    formEditar.classList.add('d-none');
    selectEditar.value = '';
});
 
document.addEventListener('DOMContentLoaded', () => {
    carregarCampanhasEditar();
});
 