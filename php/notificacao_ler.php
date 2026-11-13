<?php
require __DIR__.'/base.php';$id=autenticado();exigir_post();$n=(int)($_POST['id_notificacao']??0);$db=banco();$stmt=$db->prepare('UPDATE notificacao SET status_leitura=1 WHERE id_notificacao=? AND id_usuario_notificado=?');$stmt->bind_param('ii',$n,$id);$stmt->execute();$stmt->close();responder('ok','Notificação lida.');
