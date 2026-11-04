<?php
    include_once('../conexao.php');

    $retorno = [
        'status'    => '', // ok - nok
        'mensagem'  => '', // mensagem que envio para o front
        'data'      => []
    ];

    if(isset($_GET['id'])){
        // RECEBENDO O ID por GET
        $stmt = $conexao->prepare("DELETE FROM item WHERE id_item = ?");
        $stmt->bind_param("i",$_GET['id']);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Registro excluido',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Registro não excluido',
                'data'      => []
            ];
        }
        $stmt->close();
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'É necessário informar um ID para exclusão',
            'data'      => []
        ];
    }

    $conexao->close();
    header("Content-type:application/json;charset=utf-8");
    echo json_encode($retorno);
