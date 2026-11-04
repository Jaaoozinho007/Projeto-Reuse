<?php
include_once('../conexao.php');

mysqli_report(MYSQLI_REPORT_OFF);
$conexao->set_charset('utf8mb4');

$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_item = (int) ($_POST['id_item'] ?? 0);
$id_usuario = (int) ($_POST['id_usuario'] ?? 0);
$mensagem = trim($_POST['mensagem'] ?? '');
$local = trim($_POST['local'] ?? '');
$status = trim($_POST['status'] ?? '');

if ($id_item == 0 || $id_usuario == 0 || empty($local) || empty($status)) {
    $retorno['status'] = 'nok';
    $retorno['mensagem'] = 'Item, solicitante, local e status sao obrigatorios.';
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare(
    'INSERT INTO solicitacao(mensagem, local_retirada_sugerido, status_soli, data_solicitacao, id_usuario_solicitante)
     VALUES (?, ?, ?, CURDATE(), ?)'
);
$stmt->bind_param('sssi', $mensagem, $local, $status, $id_usuario);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    $id_solicitacao = $conexao->insert_id;

    $stmt2 = $conexao->prepare(
        'INSERT INTO solicitacao_item(id_item, id_solicitacao) VALUES (?, ?)'
    );
    $stmt2->bind_param('ii', $id_item, $id_solicitacao);
    $stmt2->execute();

    if ($stmt2->affected_rows > 0) {
        $retorno['status'] = 'ok';
        $retorno['mensagem'] = 'Registro inserido com sucesso';
    } else {
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Falha ao vincular o item a solicitacao';
    }
    $stmt2->close();
} else {
    $retorno['status'] = 'nok';
    $retorno['mensagem'] = 'Falha ao inserir o registro';
}

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);