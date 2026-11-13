<?php
require __DIR__.'/base.php';
$id=autenticado(); exigir_post();
$nome=trim($_POST['nome']??''); $descricao=trim($_POST['descricao']??'');
$estado=trim($_POST['estado']??''); $tipo=trim($_POST['tipo']??'Doação');
$local=trim($_POST['localizacao']??''); $categoria=(int)($_POST['categoria']??0);
$visivel=(int)($_POST['visivel']??0); $rascunho=($_POST['rascunho']??'0')==='1';
if (mb_strlen($nome)>50 || mb_strlen($descricao)>300 || mb_strlen($local)>30) responder('nok','Campo excede o tamanho permitido.');
if (!$rascunho && (!$nome || !$descricao || !$local || !$categoria || !in_array($estado,['Novo','Seminovo','Usado','Desgastado'],true))) responder('nok','Preencha todos os campos obrigatórios.');
if (!in_array($tipo,['Doação','Troca'],true) || !in_array($visivel,[0,1],true)) responder('nok','Opção inválida.');
$foto='';
if (!empty($_FILES['foto']['name'])) {
    $f=$_FILES['foto'];
    if ($f['error']!==UPLOAD_ERR_OK || $f['size']>2*1024*1024) responder('nok','Imagem deve ter até 2 MB.');
    $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    $ext=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'][$mime]??null;
    if (!$ext || !getimagesize($f['tmp_name'])) responder('nok','Envie JPG, PNG ou WebP válido.');
    $dir=__DIR__.'/../uploads'; if(!is_dir($dir)) mkdir($dir,0755,true);
    $foto='uploads/'.bin2hex(random_bytes(16)).'.'.$ext;
    if(!move_uploaded_file($f['tmp_name'],__DIR__.'/../'.$foto)) responder('nok','Falha ao salvar imagem.');
}
$db=banco();
if($categoria) {
 $v=$db->prepare('SELECT id_categoria FROM categoria WHERE id_categoria=?');$v->bind_param('i',$categoria);$v->execute();$exists=$v->get_result()->num_rows>0;$v->close();
 if(!$exists) responder('nok','Categoria inexistente.');
}
$status=$rascunho?'Rascunho':'Disponível';
$stmt=$db->prepare('INSERT INTO item(nome,descricao,estado_conservacao,tipo_negociacao,fotos,localizacao,localizacao_visivel,status_item,data_publicacao,id_usuario_publicador,id_categoria_item) VALUES (?,?,?,?,?,?,?,?,CURDATE(),?,?)');
$stmt->bind_param('ssssssisii',$nome,$descricao,$estado,$tipo,$foto,$local,$visivel,$status,$id,$categoria);
try {$stmt->execute();} catch(Throwable $e) {if($foto) @unlink(__DIR__.'/../'.$foto); responder('nok','Não foi possível salvar o produto.');}
$newid=$db->insert_id;$stmt->close();$db->close();
responder('ok',$rascunho?'Rascunho salvo.':'Produto anunciado com sucesso.',['id_item'=>$newid]);
