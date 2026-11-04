// js/produtos/produtos.js
// Caminho: FRONT (este arquivo) > BACK (php/produtos/) > BANCO (MySQL)

const API = 'php/produtos/';

document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
    carregarUsuarios();
    buscar();
});

// Botão Salvar: se o campo id está vazio é um item NOVO,
// se tem id é uma ALTERAÇÃO
document.getElementById("enviar").addEventListener("click", () => {
    var id = document.getElementById("id").value;
    if(id == ""){
        novo();
    }else{
        alterar(id);
    }
});

document.getElementById("cancelar").addEventListener("click", () => {
    limparFormulario();
});

// ----------------------------------------------
// Preenche os selects (categoria e publicador) com dados do BANCO
async function carregarCategorias(){
    const retorno = await fetch(API + "produto_categoria_get.php");
    const resposta = await retorno.json();
    var html = "";
    if(resposta.status == "ok"){
        for(var i=0;i<resposta.data.length;i++){
            html += `<option value="${resposta.data[i].id_categoria}">${resposta.data[i].nome}</option>`;
        }
    }
    document.getElementById("categoria").innerHTML = html;
}

async function carregarUsuarios(){
    const retorno = await fetch(API + "produto_usuario_get.php");
    const resposta = await retorno.json();
    var html = "";
    if(resposta.status == "ok"){
        for(var i=0;i<resposta.data.length;i++){
            html += `<option value="${resposta.data[i].id_usuario}">${resposta.data[i].nome}</option>`;
        }
    }
    document.getElementById("usuario").innerHTML = html;
}

// ----------------------------------------------
// (R) READ - listar todos
async function buscar(){
    const retorno = await fetch(API + "produto_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }else{
        document.getElementById("lista").innerHTML = "Nenhum produto cadastrado.";
    }
}

function preencherTabela(tabela){
    var html = `
        <table class="table table-striped">
            <tr>
                <th> Nome </th>
                <th> Estado </th>
                <th> Tipo </th>
                <th> Localização </th>
                <th> Status </th>
                <th> Data </th>
                <th> # </th>
            </tr>`;
    for(var i=0;i<tabela.length;i++){
        html += `
            <tr>
                <td>${tabela[i].nome}</td>
                <td>${tabela[i].estado_conservacao}</td>
                <td>${tabela[i].tipo_negociacao}</td>
                <td>${tabela[i].localizacao}</td>
                <td>${tabela[i].status_item}</td>
                <td>${tabela[i].data_publicacao}</td>
                <td>
                    <a href='#' onclick='editar(${tabela[i].id_item})'>Alterar</a>
                    <a href='#' onclick='excluir(${tabela[i].id_item})'>Excluir</a>
                </td>
            </tr>
        `;
    }
    html += '</table>';
    document.getElementById("lista").innerHTML = html;
}

// ----------------------------------------------
// Monta o FormData com os campos do formulário
// (os nomes aqui são os mesmos usados no $_POST do PHP)
function pegarDados(){
    const fd = new FormData();
    fd.append("nome", document.getElementById("nome").value);
    fd.append("descricao", document.getElementById("descricao").value);
    fd.append("estado", document.getElementById("estado").value);
    fd.append("tipo", document.getElementById("tipo").value);
    fd.append("fotos", document.getElementById("fotos").value);
    fd.append("localizacao", document.getElementById("localizacao").value);
    fd.append("visivel", document.getElementById("visivel").value);
    fd.append("status", document.getElementById("status").value);
    fd.append("data", document.getElementById("data").value);
    fd.append("categoria", document.getElementById("categoria").value);
    fd.append("usuario", document.getElementById("usuario").value);
    return fd;
}

// ----------------------------------------------
// (C) CREATE
async function novo(){
    const fd = pegarDados();
    const retorno = await fetch(API + "produto_novo.php",
        {
          method: 'POST',
          body: fd
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        limparFormulario();
        buscar();
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

// ----------------------------------------------
// (U) UPDATE - Fase 1: busca o registro pelo ID e preenche o formulário
async function editar(id){
    const retorno = await fetch(API + "produto_get.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        var registro = resposta.data[0];
        document.getElementById("id").value = registro.id_item;
        document.getElementById("nome").value = registro.nome;
        document.getElementById("descricao").value = registro.descricao;
        document.getElementById("estado").value = registro.estado_conservacao;
        document.getElementById("tipo").value = registro.tipo_negociacao;
        document.getElementById("fotos").value = registro.fotos;
        document.getElementById("localizacao").value = registro.localizacao;
        document.getElementById("visivel").value = registro.localizacao_visivel;
        document.getElementById("status").value = registro.status_item;
        document.getElementById("data").value = registro.data_publicacao;
        document.getElementById("categoria").value = registro.id_categoria_item;
        document.getElementById("usuario").value = registro.id_usuario_publicador;
        window.scrollTo(0, 0);
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

// (U) UPDATE - Fase 2: envia o ID na URL e os dados no body
async function alterar(id){
    const fd = pegarDados();
    const retorno = await fetch(API + "produto_alterar.php?id="+id,
        {
          method: 'POST',
          body: fd
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        limparFormulario();
        buscar();
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

// ----------------------------------------------
// (D) DELETE
async function excluir(id){
    if(confirm("Tem certeza que deseja excluir este produto?")){
        const retorno = await fetch(API + "produto_excluir.php?id="+id);
        const resposta = await retorno.json();
        alert(resposta.mensagem);
        if(resposta.status == "ok"){
            buscar();
        }
    }
}

// ----------------------------------------------
function limparFormulario(){
    var campos = ["id", "nome", "descricao", "fotos", "localizacao", "data"];
    for(var i=0;i<campos.length;i++){
        document.getElementById(campos[i]).value = "";
    }
    var selects = ["estado", "tipo", "status", "visivel", "categoria", "usuario"];
    for(var i=0;i<selects.length;i++){
        document.getElementById(selects[i]).selectedIndex = 0;
    }
}
