<?php
include_once('../conexao.php');

mysqli_report(MYSQLI_REPORT_OFF);
$conexao->set_charset('utf8mb4');

$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
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
        'UPDATE solicitacao
         SET mensagem = ?, local_retirada_sugerido = ?, status_soli = ?, id_usuario_solicitante = ?
         WHERE id_solicitacao = ?'
    );
    $stmt->bind_param('sssii', $mensagem, $local, $status, $id_usuario, $_GET['id']);
    $stmt->execute();

    $stmt2 = $conexao->prepare(
        'UPDATE solicitacao_item SET id_item = ? WHERE id_solicitacao = ?'
    );
    $stmt2->bind_param('ii', $id_item, $_GET['id']);
    $stmt2->execute();

    if ($stmt->affected_rows > 0 || $stmt2->affected_rows > 0) {
        $retorno['status'] = 'ok';
        $retorno['mensagem'] = 'Registro alterado com sucesso.';
    } else {
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Nenhum dado foi modificado.';
    }

    $stmt->close();
    $stmt2->close();
} else {
    $retorno['status'] = 'nok';
    $retorno['mensagem'] = 'ID nao informado.';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);