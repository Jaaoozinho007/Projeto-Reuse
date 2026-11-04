<?php
include_once('../conexao.php');

mysqli_report(MYSQLI_REPORT_OFF);
$conexao->set_charset('utf8mb4');

$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$sql = 'SELECT s.id_solicitacao, s.mensagem, s.local_retirada_sugerido,
               s.status_soli, s.id_usuario_solicitante,
               u.nome AS solicitante, si.id_item, i.nome AS item
        FROM solicitacao s
        LEFT JOIN usuario u           ON u.id_usuario = s.id_usuario_solicitante
        LEFT JOIN solicitacao_item si ON si.id_solicitacao = s.id_solicitacao
        LEFT JOIN item i              ON i.id_item = si.id_item';

if (isset($_GET['id'])) {
    $stmt = $conexao->prepare($sql . ' WHERE s.id_solicitacao = ?');
    $stmt->bind_param('i', $_GET['id']);
} else {
    $stmt = $conexao->prepare($sql . ' ORDER BY s.id_solicitacao DESC');
}

$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];

if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $tabela[] = $linha;
    }
    $retorno['status'] = 'ok';
    $retorno['mensagem'] = 'Consulta efetuada.';
    $retorno['data'] = $tabela;
} else {
    $retorno['status'] = 'nok';
    $retorno['mensagem'] = 'Nao ha registros';
}

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);