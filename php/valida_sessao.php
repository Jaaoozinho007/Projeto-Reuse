<?php
require __DIR__.'/base.php';
$id = autenticado();
responder('ok','Sessão ativa.',['id_usuario'=>$id,'nome'=>$_SESSION['nome'],'csrf'=>$_SESSION['csrf']]);
