<?php
require __DIR__.'/base.php'; autenticado(); $db=banco();
$result=$db->query('SELECT id_categoria, nome FROM categoria ORDER BY nome');
responder('ok','Categorias.', $result->fetch_all(MYSQLI_ASSOC));
