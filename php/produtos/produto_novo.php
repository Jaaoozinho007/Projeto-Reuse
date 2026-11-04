<?php
    include_once('../conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    // Validação: campos que não podem chegar vazios
    if(empty($_POST['nome']) || empty($_POST['data']) || empty($_POST['categoria']) || empty($_POST['usuario'])){
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Preencha nome, data, categoria e publicador.',
            'data'      => []
        ];
    }else{
        // Informações que vêm do front (FormData -> $_POST)
        $nome       = $_POST['nome'];
        $descricao  = $_POST['descricao'];
        $estado     = $_POST['estado'];
        $tipo       = $_POST['tipo'];
        $fotos      = $_POST['fotos'];
        $local      = $_POST['localizacao'];
        $visivel    = (int) $_POST['visivel'];
        $status     = $_POST['status'];
        $data       = $_POST['data'];
        $usuario    = (int) $_POST['usuario'];
        $categoria  = (int) $_POST['categoria'];

        // Preparando para inserção no banco de dados
        $stmt = $conexao->prepare("
        INSERT INTO item(nome, descricao, estado_conservacao, tipo_negociacao, fotos, localizacao, localizacao_visivel, status_item, data_publicacao, id_usuario_publicador, id_categoria_item) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
        // 6 strings + 1 inteiro + 2 strings + 2 inteiros
        $stmt->bind_param("ssssssissii", $nome, $descricao, $estado, $tipo, $fotos, $local, $visivel, $status, $data, $usuario, $categoria);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Registro inserido com sucesso',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Falha ao inserir o registro',
                'data'      => []
            ];
        }
        $stmt->close();
    }

    $conexao->close();
    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
