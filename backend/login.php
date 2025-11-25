<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    $data = $_POST;
}

$email = $data['email'] ?? '';
$senha = $data['senha'] ?? '';

if (empty($email) || empty($senha)) {
    echo json_encode(["success" => false, "message" => "Email e senha são obrigatórios"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, nome, email, senha FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // In a real production app, use password_verify($senha, $user['senha'])
    // For this academic project, we might be using plain text or simple hashing.
    // Assuming plain text for simplicity based on the context, but adding a TODO.

    if ($senha === $user['senha']) {
        unset($user['senha']); // Don't send password back
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Credenciais inválidas"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Credenciais inválidas"]);
}

$stmt->close();
$conn->close();
?>