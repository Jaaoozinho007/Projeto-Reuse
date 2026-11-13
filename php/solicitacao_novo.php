<?php
require __DIR__.'/base.php';
$id=autenticado(); exigir_post();
$item=(int)($_POST['id_item']??0); $mensagem=trim($_POST['mensagem']??'');
if($item<=0 || mb_strlen($mensagem)>300) responder('nok','Produto inválido ou mensagem acima de 300 caracteres.');
$db=banco(); $db->begin_transaction();
try {
 $stmt=$db->prepare('SELECT status_item,id_usuario_publicador FROM item WHERE id_item=? FOR UPDATE');
 $stmt->bind_param('i',$item);$stmt->execute();$produto=$stmt->get_result()->fetch_assoc();$stmt->close();
 if(!$produto || $produto['status_item']!=='Disponível') { $db->rollback(); responder('nok','Produto indisponível.'); }
 if((int)$produto['id_usuario_publicador']===$id) { $db->rollback(); responder('nok','Você não pode solicitar seu próprio produto.'); }
 $stmt=$db->prepare("SELECT s.id_solicitacao FROM solicitacao s JOIN solicitacao_item si ON si.id_solicitacao=s.id_solicitacao WHERE si.id_item=? AND s.id_usuario_solicitante=? LIMIT 1");
 $stmt->bind_param('ii',$item,$id);$stmt->execute();$ja=$stmt->get_result()->num_rows>0;$stmt->close();
 if($ja) {$db->rollback();responder('nok','Você já solicitou este produto.');}
 $status='Pendente';$local='A combinar';
 $stmt=$db->prepare('INSERT INTO solicitacao(mensagem,local_retirada_sugerido,status_soli,data_solicitacao,id_usuario_solicitante) VALUES (?,?,?,CURDATE(),?)');
 $stmt->bind_param('sssi',$mensagem,$local,$status,$id);$stmt->execute();$sol=$db->insert_id;$stmt->close();
 $stmt=$db->prepare('INSERT INTO solicitacao_item(id_item,id_solicitacao) VALUES (?,?)');$stmt->bind_param('ii',$item,$sol);$stmt->execute();$stmt->close();
 $db->commit();$db->close();responder('ok','Solicitação enviada! O resultado será informado posteriormente.',['id_solicitacao'=>$sol]);
} catch(Throwable $e) {$db->rollback();responder('nok','Não foi possível registrar a solicitação.');}
