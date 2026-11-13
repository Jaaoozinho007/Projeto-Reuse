<?php
require __DIR__ . '/base.php';

// O destinatário é o usuário que publicou o produto.
$id_usuario = autenticado();
$conexao = banco();

$stmt = $conexao->prepare(
    'SELECT s.id_solicitacao, s.status_soli, s.mensagem,
            s.data_solicitacao, s.local_retirada_sugerido,
            i.id_item, i.nome AS produto,
            u.nome AS solicitante, u.id_usuario AS id_solicitante
     FROM solicitacao s
     INNER JOIN solicitacao_item si ON si.id_solicitacao = s.id_solicitacao
     INNER JOIN item i ON i.id_item = si.id_item
     INNER JOIN usuario u ON u.id_usuario = s.id_usuario_solicitante
     WHERE i.id_usuario_publicador = ? AND s.status_soli <> \'Excluída\'
     ORDER BY s.id_solicitacao DESC
     LIMIT 100'
);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$resultado = $stmt->get_result();
$solicitacoes = [];
while ($linha = $resultado->fetch_assoc()) {
    $solicitacoes[] = $linha;
}
$stmt->close();
$conexao->close();
responder('ok', 'Solicitações recebidas consultadas.', $solicitacoes);
