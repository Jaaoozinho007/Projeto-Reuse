<?php
    include_once('../conexao.php');

    // Configurando o padrão de retorno em todas
    // as situações
    $retorno = [
        'status'    => '', // ok - nok
        'mensagem'  => '', // mensagem que envio para o front
        'data'      => []
    ];

    if (isset($_GET['id'])){
        // Segunda situação - RECEBENDO O ID por GET (usado para editar)
        $stmt = $conexao->prepare("SELECT id_item, nome, descricao, estado_conservacao, tipo_negociacao, fotos, localizacao, localizacao_visivel, status_item, data_publicacao, id_usuario_publicador, id_categoria_item FROM item WHERE id_item = ?");
        $stmt->bind_param("i",$_GET['id']);
    }
    else {
        // Primeira situação - SEM RECEBER O ID por GET (usado na lista)
        $stmt = $conexao->prepare("SELECT id_item, nome, estado_conservacao, tipo_negociacao, localizacao, status_item, data_publicacao FROM item");
    }

    // Vou executar a query
    $stmt->execute();
    $resultado = $stmt->get_result();

    // Criando um array vazio para receber o resultado
    // do banco de Dados
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

    // Fechamento do estado e conexão.
    $stmt->close();
    $conexao->close();

    // Estou enviando para o FRONT o array RETORNO
    // mas no formato JSON
    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
