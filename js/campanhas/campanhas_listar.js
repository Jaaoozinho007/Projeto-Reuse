async function listarCampanhas() {
    const tabela = document.getElementById('tabela-campanhas-body');
    const registros = await buscarCampanhas();
 
    if (registros.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Nenhuma campanha cadastrada.</td>
            </tr>`;
        return;
    }
 
    tabela.innerHTML = registros.map(c => `
        <tr>
            <td>${esc(c.titulo)}</td>
            <td>${esc(c.ong)}</td>
            <td>${esc(c.categoria_necessaria)}</td>
            <td>${esc(c.status_campanha)}</td>
            <td>${esc(c.descricao)}</td>
        </tr>`).join('');
}
 
document.addEventListener('DOMContentLoaded', () => {
    listarCampanhas();
});
 