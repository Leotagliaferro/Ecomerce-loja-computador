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
    $data = $_POST;
}

$nome = trim($data['nome'] ?? '');
$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';
$confirmarSenha = $data['confirmarSenha'] ?? '';

// Validações
if (empty($nome) || empty($email) || empty($senha)) {
    echo json_encode(["success" => false, "message" => "Todos os campos são obrigatórios"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "E-mail inválido"]);
    exit;
}

if ($senha !== $confirmarSenha) {
    echo json_encode(["success" => false, "message" => "As senhas não coincidem"]);
    exit;
}

if (strlen($senha) < 6) {
    echo json_encode(["success" => false, "message" => "A senha deve ter no mínimo 6 caracteres"]);
    exit;
}

// Verificar se email já existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "E-mail já cadastrado"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Inserir novo usuário
$stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nome, $email, $senha);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Cadastro realizado com sucesso!",
        "user" => [
            "id" => $userId,
            "nome" => $nome,
            "email" => $email
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao realizar cadastro"]);
}

$stmt->close();
$conn->close();
?>