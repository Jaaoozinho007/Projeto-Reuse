<?php

$servidor = 'localhost';
$usuario = 'root';
$senha = '';
$nome_banco = 'reuse';

$conexao = new mysqli(
    $servidor,
    $usuario,
    $senha,
    $nome_banco
);

if ($conexao->connect_error) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 'nok',
        'mensagem' => 'Erro ao conectar ao banco.',
        'data' => []
    ]);
    exit;
}

$conexao->set_charset('utf8mb4');