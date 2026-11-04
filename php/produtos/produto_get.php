<?php
    include_once('../conexao.php');

   
    $retorno = [
        'status'    => '', 
        'mensagem'  => '', 
        'data'      => []
    ];

    if (isset($_GET['id'])){
        
        $stmt = $conexao->prepare("SELECT id_item, nome, descricao, estado_conservacao, tipo_negociacao, fotos, localizacao, localizacao_visivel, status_item, data_publicacao, id_usuario_publicador, id_categoria_item FROM item WHERE id_item = ?");
        $stmt->bind_param("i",$_GET['id']);
    }
    else {
        
        $stmt = $conexao->prepare("SELECT id_item, nome, estado_conservacao, tipo_negociacao, localizacao, status_item, data_publicacao FROM item");
    }

    
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
            'mensagem'  => 'Não há registros',
            'data'      => []
        ];
    }

   
    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
