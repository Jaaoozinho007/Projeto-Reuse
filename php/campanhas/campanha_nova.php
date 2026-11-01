<?php 
include_once ('../conexao.php');
$retorno = ['status' => '',
    'mensagem' => '',
    'data' => []
];

$titulo = $_POST ['titulo'] ?? '';
$descricao = $_POST ['descricao'] ?? '';
$meta = $_POST ['meta'] ?? 0;
$categoria_necessaria = $_POST ['categoria_necessaria'] ?? '';
$quantidade_atual = $_POST ['quantidade_atual'] ?? 0;
$status_campanha = $_POST ['status_campanha'] ?? '';
$id_instituicao_publicante = $_POST ['id_instituicao_publicante'] ?? 0;


$stmt = $conexao -> prepare ("
INSERT INTO campanha (titulo, descricao, meta, categoria_necessaria, quantidade_atual,
status_campanha, id_instituicao_publicante) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt -> bind_param ("ssisisi", $titulo, $descricao, $meta, $categoria_necessaria, $quantidade_atual,$status_campanha,
$id_instituicao_publicante);
$stmt->execute();

if ($stmt->affected_rows > 0){
    $retorno =[
        'status' => 'ok',
        'mensagem' => 'registro inserido!',
        'data' => []
    ];
}else{
    $retorno =[
        'status'=>'nok',
        'mensagem'=>'falha ao inserir registro',
        'data'=>[]
    ];
}

$stmt->close();
$conexao->close();

header ("Content-type: application/json; charset:utf-8");
echo json_encode ($retorno);

?>
