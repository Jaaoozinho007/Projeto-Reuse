<?php
require __DIR__.'/base.php';$id=autenticado();exigir_post();
$nome=trim($_POST['nome']??'');$email=trim($_POST['email']??'');$telefone=trim($_POST['telefone']??'');$local=trim($_POST['localizacao']??'');
if(mb_strlen($nome)<2||mb_strlen($nome)>50||!filter_var($email,FILTER_VALIDATE_EMAIL)||mb_strlen($email)>50||mb_strlen($telefone)>20||mb_strlen($local)>30) responder('nok','Verifique os dados obrigatórios.');
$db=banco();$stmt=$db->prepare('SELECT id_usuario FROM usuario WHERE email=? AND id_usuario<>?');$stmt->bind_param('si',$email,$id);$stmt->execute();$dup=$stmt->get_result()->num_rows;$stmt->close();if($dup)responder('nok','E-mail já cadastrado.');
$stmt=$db->prepare('UPDATE usuario SET nome=?,email=?,telefone=?,localizacao=? WHERE id_usuario=?');$stmt->bind_param('ssssi',$nome,$email,$telefone,$local,$id);$stmt->execute();$stmt->close();$_SESSION['nome']=$nome;responder('ok','Perfil atualizado.');
