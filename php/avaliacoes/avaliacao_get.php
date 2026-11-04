<?php 
include_once('../conexao.php');
 
mysqli_report(MYSQLI_REPORT_OFF);  
$conexao->set_charset('utf8mb4');  
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
$sql = 'SELECT a.*, u1.nome AS avaliador, u2.nome AS avaliado
        FROM avaliacao a
        LEFT JOIN usuario u1 ON u1.id_usuario = a.id_usuario_avaliador
        LEFT JOIN usuario u2 ON u2.id_usuario = a.id_usuario_avaliado';
 
if (isset($_GET['id'])) {
    $stmt = $conexao->prepare($sql . ' WHERE a.id_avaliacao = ?');
    $stmt->bind_param('i', $_GET['id']);
} else {
    $stmt = $conexao->prepare($sql . ' ORDER BY a.id_avaliacao');
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