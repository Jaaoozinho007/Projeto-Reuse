<?php
require __DIR__.'/base.php';$id=autenticado();exigir_post();$atual=(string)($_POST['atual']??'');$nova=(string)($_POST['nova']??'');
if(strlen($nova)<8||strlen($nova)>72)responder('nok','Nova senha deve ter de 8 a 72 caracteres.');
$db=banco();$stmt=$db->prepare('SELECT senha FROM usuario WHERE id_usuario=?');$stmt->bind_param('i',$id);$stmt->execute();$u=$stmt->get_result()->fetch_assoc();$stmt->close();if(!$u||( !password_verify($atual,$u['senha'])&&!hash_equals($u['senha'],$atual)))responder('nok','Senha atual incorreta.');
$hash=password_hash($nova,PASSWORD_DEFAULT);$stmt=$db->prepare('UPDATE usuario SET senha=? WHERE id_usuario=?');$stmt->bind_param('si',$hash,$id);$stmt->execute();$stmt->close();session_regenerate_id(true);responder('ok','Senha alterada.');
