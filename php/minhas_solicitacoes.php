<?php
require __DIR__.'/base.php';$id=autenticado();$db=banco();
$stmt=$db->prepare('SELECT s.id_solicitacao,s.status_soli,s.mensagem,i.nome AS produto,i.id_item FROM solicitacao s JOIN solicitacao_item si ON si.id_solicitacao=s.id_solicitacao JOIN item i ON i.id_item=si.id_item WHERE s.id_usuario_solicitante=? ORDER BY s.id_solicitacao DESC LIMIT 100');
$stmt->bind_param('i',$id);$stmt->execute();$rows=$stmt->get_result()->fetch_all(MYSQLI_ASSOC);$stmt->close();$db->close();responder('ok','Suas solicitações.',$rows);
