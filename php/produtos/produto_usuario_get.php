<?php
    include_once('../conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    // Busca os usuários para preencher o select "publicador"
    $stmt = $conexao->prepare("SELECT id_usuario, nome FROM usuario");
    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];

    if ($resultado->num_rows > 0){
        while ($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sucesso, consulta efetuada.',
            'data'      => $tabela
        ];
    }
    else {
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não há usuários cadastrados',
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();
    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
