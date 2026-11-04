const formCriar = document.getElementById('form-criar');
 
formCriar.addEventListener('submit', (event) => {
    event.preventDefault();
    novo();
});
 
async function novo() {
    const fd = new FormData();
    fd.append('titulo',         document.getElementById('criar-titulo').value);
    fd.append('descricao',      document.getElementById('descricao').value);
    fd.append('id_instituicao', document.getElementById('ong').value);
    fd.append('categoria',      document.getElementById('categoria').value);
    fd.append('status',         document.getElementById('status').value);
    fd.append('meta',           document.getElementById('meta').value);
 
    const retorno = await fetch(API + 'campanha_novo.php', {
        method: 'POST',
        body: fd
    });
    const resposta = await retorno.json();
 
    if (resposta.status == 'ok') {
        alert('SUCESSO: ' + resposta.mensagem);
        formCriar.reset();
        atualizarTela();
    } else {
        alert('ERRO: ' + resposta.mensagem);
    }
}
 