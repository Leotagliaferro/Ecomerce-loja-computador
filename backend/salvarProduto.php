<?php
// CONFIGURAÇÕES DE ERRO
ini_set('display_errors', 0); // não mostra HTML de erro
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// RETORNO EM JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// CAPTURA ERROS FATAIS
register_shutdown_function(function() {
    $err = error_get_last();
    if ($err) {
        http_response_code(500);
        echo json_encode([
            "erro" => "Fatal error",
            "details" => $err
        ]);
    }
});

// CAPTURA ERROS E WARNINGS
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    // DIRETÓRIO DE UPLOAD
    $upload_dir = __DIR__ . '/../uploads/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

    // CONEXÃO COM DB
    $conn = new mysqli("localhost", "root", "", "ecommerce");
    if ($conn->connect_error) {
        throw new Exception("Falha na conexão com o DB: " . $conn->connect_error);
    }

    // PEGAR DADOS DO POST
    $nome = $_POST["nome"] ?? '';
    $descricao = $_POST["descricao"] ?? '';
    $preco = floatval($_POST["preco"] ?? 0);
    $categoria = $_POST["categoria"] ?? '';
    $estoque = intval($_POST["estoque"] ?? 0);
    $marca = $_POST["marca"] ?? '';
    $modelo = $_POST["modelo"] ?? '';
    $imagem = null;

    // UPLOAD DE IMAGEM
    if (!empty($_FILES["imagem"]["name"]) && $_FILES["imagem"]["error"] === UPLOAD_ERR_OK) {
        $file = $_FILES["imagem"];
        $filename = time() . "-" . basename($file["name"]);
        $target_file = $upload_dir . $filename;
        if (!move_uploaded_file($file["tmp_name"], $target_file)) {
            throw new Exception("Falha ao mover o arquivo");
        }
        $imagem = $filename;
    }

    // PREPARAR STATEMENT
    $stmt = $conn->prepare("
        INSERT INTO produtos 
        (nome, descricao, preco, categoria, imagem, estoque, marca, modelo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if (!$stmt) throw new Exception("Falha ao preparar statement: " . $conn->error);

    $stmt->bind_param("ssdssiss", $nome, $descricao, $preco, $categoria, $imagem, $estoque, $marca, $modelo);

    // EXECUTAR
    if ($stmt->execute()) {
        echo json_encode([
            "sucesso" => true,
            "id" => $conn->insert_id
        ]);
    } else {
        throw new Exception("Erro ao salvar produto no DB: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "erro" => $e->getMessage()
    ]);
}
