<?php
require __DIR__.'/base.php';$id=autenticado();exigir_post();
$sol=(int)($_POST['id_solicitacao']??0);$nota=(int)($_POST['nota']??0);$comentario=trim($_POST['comentario']??'');
if($nota<1 || $nota>5) responder('nok','Informe uma nota de 1 a 5.');
if($sol<=0 || mb_strlen($comentario)>300) responder('nok','Dados de avaliação inválidos.');
$db=banco();
$stmt=$db->prepare("SELECT i.id_item FROM solicitacao s JOIN solicitacao_item si ON si.id_solicitacao=s.id_solicitacao JOIN item i ON i.id_item=si.id_item WHERE s.id_solicitacao=? AND s.id_usuario_solicitante=? AND s.status_soli='Concluída' AND i.status_item='Concluído'");
$stmt->bind_param('ii',$sol,$id);$stmt->execute();$produto=$stmt->get_result()->fetch_assoc();$stmt->close();
if(!$produto) responder('nok','Não há doação concluída válida para avaliar.');
$item=(int)$produto['id_item'];
try {
 $stmt=$db->prepare('INSERT INTO avaliacao_produto(id_solicitacao,id_item,id_usuario_avaliador,nota,comentario,data_avaliacao) VALUES (?,?,?,?,?,CURDATE())');
 $stmt->bind_param('iiiis',$sol,$item,$id,$nota,$comentario);$stmt->execute();$stmt->close();$db->close();
 responder('ok','Avaliação registrada com sucesso.');
} catch(mysqli_sql_exception $e) {responder('nok','Este produto já foi avaliado por você ou ocorreu um erro.');}
