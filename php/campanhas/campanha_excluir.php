<?php
include_once('../conexao.php');
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
if (isset($_GET['id'])) {
    $stmt = $conexao->prepare('DELETE FROM campanha WHERE id_campanha = ?');
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();
 
    if ($stmt->affected_rows > 0) {
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Campanha excluida';
    } else {
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Campanha nao excluida';
    }
    $stmt->close();
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'E necessario informar um ID para exclusao';
}
 
$conexao->close();
 
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
 