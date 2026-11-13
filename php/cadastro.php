<?php
// Cadastro de usuário: formulário HTML -> Fetch/FormData -> PHP -> MySQL.
require __DIR__ . '/base.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    responder('nok', 'Método não permitido.');
}

$nome = trim($_POST['nome'] ?? '');
$email = strtolower(trim($_POST['email'] ?? ''));
$telefone = trim($_POST['telefone'] ?? '');
$localizacao = trim($_POST['localizacao'] ?? '');
$senha = (string)($_POST['senha'] ?? '');
$confirmacao = (string)($_POST['confirmar_senha'] ?? '');

if ($nome === '' || mb_strlen($nome) < 2 || mb_strlen($nome) > 50) responder('nok', 'Informe um nome de 2 a 50 caracteres.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 50) responder('nok', 'Informe um e-mail válido de até 50 caracteres.');
if (mb_strlen($telefone) > 20 || mb_strlen($localizacao) > 30) responder('nok', 'Telefone ou localização excede o limite permitido.');
if (strlen($senha) < 8 || strlen($senha) > 72) responder('nok', 'A senha deve ter de 8 a 72 caracteres.');
if ($senha !== $confirmacao) responder('nok', 'As senhas não coincidem.');

$conexao = banco();
$stmt = $conexao->prepare('SELECT id_usuario FROM usuario WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$existe = $stmt->get_result()->num_rows > 0;
$stmt->close();
if ($existe) {
    $conexao->close();
    responder('nok', 'Este e-mail já está cadastrado.');
}

$hash = password_hash($senha, PASSWORD_DEFAULT);
try {
    $stmt = $conexao->prepare('INSERT INTO usuario (nome, email, senha, telefone, localizacao, data_cadastro) VALUES (?, ?, ?, ?, ?, CURDATE())');
    $stmt->bind_param('sssss', $nome, $email, $hash, $telefone, $localizacao);
    $stmt->execute();
    $stmt->close();
    $conexao->close();
    responder('ok', 'Cadastro realizado! Entre com seu e-mail e senha.');
} catch (mysqli_sql_exception $erro) {
    $conexao->close();
    if ($erro->getCode() == 1062) responder('nok', 'Este e-mail já está cadastrado.');
    http_response_code(500);
    responder('nok', 'Não foi possível concluir o cadastro.');
}
