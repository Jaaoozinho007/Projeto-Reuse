<?php
include_once('../conexao.php');
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
$titulo       = trim($_POST['titulo'] ?? '');
$descricao    = trim($_POST['descricao'] ?? '');
$categoria    = $_POST['categoria'] ?? '';
$status       = $_POST['status'] ?? '';
$id_instit    = (int) ($_POST['id_instituicao'] ?? 0);
$meta         = (($_POST['meta'] ?? '') === '') ? null : (int) $_POST['meta'];
 
if ($titulo === '' || $categoria === '' || $status === '' || $id_instit === 0) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Titulo, ONG, categoria e status sao obrigatorios.';
    $conexao->close();
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($retorno);
    exit;
}
 
$stmt = $conexao->prepare(
    'INSERT INTO campanha(titulo, descricao, meta, categoria_necessaria,
                          quantidade_atual, status_campanha, id_instituicao_publicante)
     VALUES (?, ?, ?, ?, 0, ?, ?)'
);

$stmt->bind_param('ssissi', $titulo, $descricao, $meta, $categoria, $status, $id_instit);
 
if ($stmt->execute() && $stmt->affected_rows > 0) {
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Campanha cadastrada com sucesso';
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Falha ao inserir a campanha: ' . $stmt->error;
}
 
$stmt->close();
$conexao->close();
 
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
 