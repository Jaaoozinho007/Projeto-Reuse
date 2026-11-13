<?php
require __DIR__.'/base.php';
$id=autenticado(); $db=banco();
$alvo=(int)($_GET['id']??$id); if($alvo<1) responder('nok','Perfil inválido.');
$stmt=$db->prepare('SELECT id_usuario,nome,localizacao,foto_perfil,data_cadastro FROM usuario WHERE id_usuario=?');
$stmt->bind_param('i',$alvo);$stmt->execute();$u=$stmt->get_result()->fetch_assoc();$stmt->close();
if(!$u) responder('nok','Usuário não encontrado.');
if($alvo===$id){$stmt=$db->prepare('SELECT email,telefone FROM usuario WHERE id_usuario=?');$stmt->bind_param('i',$id);$stmt->execute();$u=array_merge($u,$stmt->get_result()->fetch_assoc());$stmt->close();}
$stmt=$db->prepare('SELECT ROUND(AVG(nota),1) media,COUNT(*) quantidade FROM avaliacao WHERE id_usuario_avaliado=?');$stmt->bind_param('i',$alvo);$stmt->execute();$u['reputacao']=$stmt->get_result()->fetch_assoc();$stmt->close();
$stmt=$db->prepare('SELECT a.nota,a.comentario,a.data_avaliacao,v.nome AS avaliador FROM avaliacao a JOIN usuario v ON v.id_usuario=a.id_usuario_avaliador WHERE a.id_usuario_avaliado=? ORDER BY a.id_avaliacao DESC LIMIT 30');$stmt->bind_param('i',$alvo);$stmt->execute();$u['avaliacoes']=$stmt->get_result()->fetch_all(MYSQLI_ASSOC);$stmt->close();$db->close();responder('ok','Perfil consultado.',$u);
