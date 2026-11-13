<?php
require __DIR__.'/base.php';
autenticado(); exigir_post();
$_SESSION = []; session_destroy(); responder('ok','Sessão encerrada.');
