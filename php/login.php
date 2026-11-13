<?php
require __DIR__.'/base.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder('nok','Método inválido.');
$email = trim($_POST['email'] ?? '');
$senha = (string)($_POST['senha'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $senha === '') responder('nok','Informe e-mail e senha.');
$conexao = banco();
$stmt = $conexao->prepare('SELECT id_usuario, nome, email, senha FROM usuario WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email); $stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc(); $stmt->close();
// Compatibilidade com o SQL acadêmico original (senhas em texto).
$valido = $usuario && (password_verify($senha, $usuario['senha']) || hash_equals($usuario['senha'], $senha));
if (!$valido) { $conexao->close(); responder('nok','E-mail ou senha inválidos.'); }
if (!password_get_info($usuario['senha'])['algo']) {
    $hash = password_hash($senha, PASSWORD_DEFAULT);
    $up = $conexao->prepare('UPDATE usuario SET senha = ? WHERE id_usuario = ?');
    $up->bind_param('si', $hash, $usuario['id_usuario']); $up->execute(); $up->close();
}
$conexao->close();
session_regenerate_id(true);
$_SESSION['id_usuario'] = (int)$usuario['id_usuario'];
$_SESSION['nome'] = $usuario['nome'];
$_SESSION['csrf'] = bin2hex(random_bytes(24));
responder('ok','Login efetuado.',['id_usuario'=>(int)$usuario['id_usuario'],'nome'=>$usuario['nome'],'csrf'=>$_SESSION['csrf']]);
