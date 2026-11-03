<?php 
include_once('conexao.php');

mysqli_report(MYSQLI_REPORT_OFF);  
$conexao->set_charset('utf8mb4');  


$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {

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
        'UPDATE avaliacao
         SET nota = ?, comentario = ?, id_usuario_avaliador = ?, id_usuario_avaliado = ?
         WHERE id_avaliacao = ?'
    );

    $stmt->bind_param('isiii', $nota, $comentario, $avaliador, $avaliado, $_GET['id']);
    $stmt->execute();

    if ($stmt->affected_rows >= 0) {
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Avaliacao alterada com sucesso.';
    } else {
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Nao foi possivel alterar a avaliacao.';
    }

    $stmt->close();
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID nao informado.';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);