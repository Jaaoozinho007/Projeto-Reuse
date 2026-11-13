<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ini_set('session.cookie_secure', '1');
session_start();
function responder($status, $mensagem, $data = []) {
    echo json_encode(['status'=>$status,'mensagem'=>$mensagem,'data'=>$data], JSON_UNESCAPED_UNICODE);
    exit;
}
function autenticado() {
    if (empty($_SESSION['id_usuario'])) { http_response_code(401); responder('nok','Faça login para continuar.'); }
    return (int)$_SESSION['id_usuario'];
}
function exigir_post() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); responder('nok','Método não permitido.'); }
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''))) {
        http_response_code(403); responder('nok','Token de segurança inválido. Atualize a página.');
    }
}
function banco() { require __DIR__.'/conexao.php'; return $conexao; }
