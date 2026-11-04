<?php // php/instituicao_get.php  (popula o select de ONG)
include_once('../conexao.php');
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
$stmt = $conexao->prepare('SELECT id_instituicao, nome FROM instituicao ORDER BY nome');
$stmt->execute();
$resultado = $stmt->get_result();
 
$tabela = [];
while ($linha = $resultado->fetch_assoc()) {
    $tabela[] = $linha;
}
 
if (count($tabela) > 0) {
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Consulta efetuada.';
    $retorno['data']     = $tabela;
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Nao ha instituicoes cadastradas';
}
 
$stmt->close();
$conexao->close();
 
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
 ?>