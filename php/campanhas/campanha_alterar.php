<?php 
include_once('../conexao.php');
 
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];
 
if (isset($_GET['id'])) {
    $titulo    = trim($_POST['titulo'] ?? '');
    $descricao = trim($_POST['descricao'] ?? '');
    $categoria = $_POST['categoria'] ?? '';
    $status    = $_POST['status'] ?? '';
    $id_instit = (int) ($_POST['id_instituicao'] ?? 0);
    $meta      = (($_POST['meta'] ?? '') === '') ? null : (int) $_POST['meta'];
 
    if ($titulo === '' || $categoria === '' || $status === '' || $id_instit === 0) {
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Titulo, ONG, categoria e status sao obrigatorios.';
    } else {
        $stmt = $conexao->prepare(
            'UPDATE campanha
             SET titulo = ?, descricao = ?, meta = ?, categoria_necessaria = ?,
                 status_campanha = ?, id_instituicao_publicante = ?
             WHERE id_campanha = ?'
        );
    
        $stmt->bind_param('ssissii', $titulo, $descricao, $meta, $categoria,
                          $status, $id_instit, $_GET['id']);
 
        
        if ($stmt->execute()) {
            $retorno['status']   = 'ok';
            $retorno['mensagem'] = 'Campanha alterada com sucesso.';
        } else {
            $retorno['status']   = 'nok';
            $retorno['mensagem'] = 'Nao foi possivel alterar a campanha: ' . $stmt->error;
        }
        $stmt->close();
    }
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID nao informado.';
}
 
$conexao->close();
 
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
 ?>