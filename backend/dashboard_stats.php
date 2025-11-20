<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "ecommerce");

if ($conn->connect_error) {
    echo json_encode(["erro" => "Falha na conexão"]);
    exit;
}

// Conta total de produtos
$sqlProdutos = "SELECT COUNT(*) as total FROM produtos";
$resProdutos = $conn->query($sqlProdutos);
$totalProdutos = $resProdutos->fetch_assoc()['total'];

// Conta produtos com estoque baixo (menor ou igual a 5)
$sqlBaixo = "SELECT COUNT(*) as total FROM produtos WHERE estoque <= 5";
$resBaixo = $conn->query($sqlBaixo);
$totalBaixo = $resBaixo->fetch_assoc()['total'];

// Conta valor total do inventário (preço * estoque)
$sqlValor = "SELECT SUM(preco * estoque) as total FROM produtos";
$resValor = $conn->query($sqlValor);
$totalValor = $resValor->fetch_assoc()['total'];

// Retorna os dados
echo json_encode([
    "produtos" => $totalProdutos,
    "estoque_baixo" => $totalBaixo,
    "valor_total" => $totalValor,
    "categorias" => 5 // Fixo por enquanto ou faça uma query COUNT(DISTINCT categoria)
]);

$conn->close();
?>