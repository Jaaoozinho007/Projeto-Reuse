<?php 
include_once('conexao.php');

mysqli_report(MYSQLI_REPORT_OFF); 
$conexao->set_charset('utf8mb4'); 


$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
    $stmt = $conexao->prepare('DELETE FROM avaliacao WHERE id_avaliacao = ?');
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Avaliacao excluida';
    } else {
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Avaliacao nao excluida';
    }

    $stmt->close();
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'E necessario informar um ID para exclusao';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);