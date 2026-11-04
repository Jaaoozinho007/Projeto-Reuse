<?php 
include_once('../conexao.php');
 
mysqli_report(MYSQLI_REPORT_OFF);  
$conexao->set_charset('utf8mb4');  
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
if (empty($_POST['avaliador']) || empty($_POST['avaliado'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Avaliador e avaliado sao obrigatorios.';
 
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($retorno);
    exit;
}
 
$avaliador  = (int) $_POST['avaliador'];
$avaliado   = (int) $_POST['avaliado'];
$nota       = (int) $_POST['nota'];
$comentario = $_POST['comentario'];
 
if ($avaliador == $avaliado) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Avaliador e avaliado devem ser diferentes.';
 
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($retorno);
    exit;
}
 
$stmt = $conexao->prepare(
    'INSERT INTO avaliacao(nota, comentario, data_avaliacao, id_usuario_avaliador, id_usuario_avaliado)
     VALUES (?, ?, CURDATE(), ?, ?)'
);
 
$stmt->bind_param('isii', $nota, $comentario, $avaliador, $avaliado);
$stmt->execute();
 
if ($stmt->affected_rows > 0) {
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Avaliacao inserida com sucesso';
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Falha ao inserir a avaliacao';
}
 
$stmt->close();
$conexao->close();
 
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);