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

    if (password_verify($senha, $user['senha'])) {
        // Senha correta
        unset($user['senha']); // Remove senha do array antes de enviar

        echo json_encode([
            "success" => true,
            "message" => "Login realizado com sucesso!",
            "user" => $user
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "E-mail ou senha incorretos"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Credenciais inválidas"]);
}

$stmt->close();
$conn->close();
?>