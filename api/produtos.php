<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// DEBUG — para garantir que SEMPRE apareça algo
echo "INICIO-PHP\n";

if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    exit; // Preflight CORS
}

$uploadDir = 'C:/xampp/htdocs/ecomerce/uploads/'; 

$method = $_SERVER['REQUEST_METHOD'];
echo "METHOD=$method\n";

$mysqli = new mysqli("localhost", "root", "", "ecommerce");

if ($mysqli->connect_error) {
    echo "ERRO-CONEXAO: " . $mysqli->connect_error;
    exit;
}

echo "DB-OK\n";

switch ($method) {

    case "POST":

        echo "POST-RECEBIDO\n";

        // DEBUG: mostrar os dados que chegaram
        print_r($_POST);
        print_r($_FILES);

        $nome = $_POST["nome"] ?? null;
        $descricao = $_POST["descricao"] ?? null;
        $preco = floatval($_POST["preco"] ?? 0);
        $categoria = $_POST["categoria"] ?? null;
        $imagemNome = ''; 
        
        $estoque = intval($_POST["estoque"] ?? 0);
        $marca = $_POST["marca"] ?? null;
        $modelo = $_POST["modelo"] ?? null;

        if (empty($nome) || $preco <= 0) {
            echo "ERRO: Nome/preço inválido";
            exit;
        }

        // Upload da imagem
        if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {

            echo "UPLOAD OK\n";

            $fileTmpPath = $_FILES['imagem']['tmp_name'];
            $fileName = $_FILES['imagem']['name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $destPath = $uploadDir . $newFileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $imagemNome = $newFileName;
                echo "IMG-SALVA: $imagemNome\n";
            } else {
                echo "ERRO-UPLOAD: Falha ao mover arquivo";
                exit;
            }
        } else {
            echo "SEM IMAGEM OU ERRO\n";
        }

        // Inserção no BD
        $stmt = $mysqli->prepare("
            INSERT INTO produtos (nome, descricao, preco, categoria, imagem, estoque, marca, modelo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        if (!$stmt) {
            echo "ERRO-PREPARE: " . $mysqli->error;
            exit;
        }

        $stmt->bind_param(
            "ssdssiss",
            $nome, 
            $descricao, 
            $preco, 
            $categoria, 
            $imagemNome, 
            $estoque,
            $marca,
            $modelo
        );

        if ($stmt->execute()) {
            echo "SUCESSO: Produto ID=" . $mysqli->insert_id;
        } else {
            echo "ERRO-EXECUTE: " . $mysqli->error;
        }

        $stmt->close();
        break;

    default:
        echo "METODO-INVALIDO";
        break;
}

$mysqli->close();
?>
