<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método inválido"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Dados inválidos"]);
    exit;
}

// In a real application, you would save the order to the database here.
// For now, we'll just simulate a successful order.

// Simulate processing delay
sleep(1);

echo json_encode([
    "success" => true,
    "message" => "Pedido realizado com sucesso!",
    "id" => rand(1000, 9999) // Mock Order ID
]);
?>