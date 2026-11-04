<?php
// Variáveis de conexão com o Banco de Dados
$servidor = "localhost";
$usuario  = "root";
$senha    = "";
$nome_banco = "reuse";

$conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
if ($conexao->connect_error){
    echo $conexao->connect_error;
}
?>
