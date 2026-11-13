<?php
require __DIR__.'/base.php';
$id=autenticado(); $db=banco();
$stmt=$db->prepare("SELECT i.id_item,i.nome,i.descricao,i.estado_conservacao,i.tipo_negociacao,i.fotos,i.localizacao,i.localizacao_visivel,i.status_item,i.id_usuario_publicador,c.nome AS categoria,u.nome AS doador, (SELECT ROUND(AVG(a.nota),1) FROM avaliacao_produto a WHERE a.id_item=i.id_item) AS media FROM item i JOIN categoria c ON c.id_categoria=i.id_categoria_item JOIN usuario u ON u.id_usuario=i.id_usuario_publicador WHERE i.status_item='Disponível' OR i.id_usuario_publicador=? ORDER BY i.id_item DESC LIMIT 100");
$stmt->bind_param('i',$id); $stmt->execute(); $rows=$stmt->get_result()->fetch_all(MYSQLI_ASSOC); $stmt->close();$db->close();
foreach($rows as &$r) { if (!$r['localizacao_visivel'] && (int)$r['id_usuario_publicador']!==$id) $r['localizacao']='Localização privada'; } unset($r);
responder('ok','Produtos encontrados.',$rows);
