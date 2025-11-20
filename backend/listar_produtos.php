<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "ecommerce");

if ($conn->connect_error) {
    echo json_encode(["erro" => "Falha na conexão com o DB", "details" => $conn->connect_error]);
    exit;
}

// Prepara e executa a consulta para buscar todos os produtos
$sql = "SELECT id, nome, descricao, preco, categoria, imagem, estoque, marca, modelo FROM produtos ORDER BY id DESC";
$result = $conn->query($sql);

$data = [];

if ($result) {
    // Puxa todos os resultados e os coloca em um array associativo
    $data = $result->fetch_all(MYSQLI_ASSOC);
} else {
    echo json_encode(["erro" => "Falha na consulta SQL", "details" => $conn->error]);
    $conn->close();
    exit;
}

$conn->close();

// Retorna o array de dados no formato JSON
echo json_encode(["data" => $data]);
?>