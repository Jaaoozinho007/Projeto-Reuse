<?php // php/campanha_get.php  (todas ou por ?id=X)
include_once('../conexao.php');
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
$sql = 'SELECT c.id_campanha, c.titulo, c.descricao, c.meta,
               c.categoria_necessaria, c.quantidade_atual, c.status_campanha,
               c.id_instituicao_publicante, i.nome AS ong
        FROM campanha c
        LEFT JOIN instituicao i ON i.id_instituicao = c.id_instituicao_publicante';
 
if (isset($_GET['id'])) {
    $stmt = $conexao->prepare($sql . ' WHERE c.id_campanha = ?');
    $stmt->bind_param('i', $_GET['id']);
} else {
    $stmt = $conexao->prepare($sql . ' ORDER BY c.id_campanha DESC');
}
 
$stmt->execute();
$resultado = $stmt->get_result();
 
$tabela = [];
if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $tabela[] = $linha;
    }
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Consulta efetuada.';
    $retorno['data']     = $tabela;
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Nao ha registros';
}
 
$stmt->close();
$conexao->close();
 
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
 ?>