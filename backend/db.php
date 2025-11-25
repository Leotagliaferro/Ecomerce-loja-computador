<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "ecommerce";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    header("Content-Type: application/json");
    echo json_encode(["erro" => "Falha na conexão com o DB", "details" => $conn->connect_error]);
    exit;
}
?>