<?php
require __DIR__.'/base.php';$id=autenticado();$db=banco();
$stmt=$db->prepare("SELECT s.id_solicitacao,i.id_item,i.nome FROM solicitacao s JOIN solicitacao_item si ON si.id_solicitacao=s.id_solicitacao JOIN item i ON i.id_item=si.id_item LEFT JOIN avaliacao_produto a ON a.id_solicitacao=s.id_solicitacao WHERE s.id_usuario_solicitante=? AND s.status_soli='Concluída' AND i.status_item='Concluído' AND a.id_avaliacao_produto IS NULL ORDER BY s.id_solicitacao DESC");
$stmt->bind_param('i',$id);$stmt->execute();$rows=$stmt->get_result()->fetch_all(MYSQLI_ASSOC);$stmt->close();$db->close();responder('ok','Produtos disponíveis para avaliação.',$rows);
