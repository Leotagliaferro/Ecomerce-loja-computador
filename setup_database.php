<?php
// Script para inicialização automática do banco de dados
header("Content-Type: text/html; charset=UTF-8");

$host = "localhost";
$user = "root";
$pass = "";

echo "<!DOCTYPE html>
<html>
<head>
    <title>Setup Database - TechHub</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #3b82f6; }
        .success { color: #10b981; padding: 10px; background: #d1fae5; border-radius: 5px; margin: 10px 0; }
        .error { color: #ef4444; padding: 10px; background: #fee2e2; border-radius: 5px; margin: 10px 0; }
        .info { color: #3b82f6; padding: 10px; background: #dbeafe; border-radius: 5px; margin: 10px 0; }
        pre { background: #1e293b; color: #f8fafc; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>";

echo "<h1>🚀 Configuração do Banco de Dados TechHub</h1>";

try {
    // Connect to MySQL (sem selecionar banco)
    $conn = new mysqli($host, $user, $pass);

    if ($conn->connect_error) {
        throw new Exception("Erro na conexão: " . $conn->connect_error);
    }

    echo "<div class='info'>✓ Conectado ao MySQL com sucesso</div>";

    // Ler arquivo setup.sql
    $sqlFile = 'setup.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("Arquivo setup.sql não encontrado!");
    }

    $sql = file_get_contents($sqlFile);

    if ($sql === false) {
        throw new Exception("Erro ao ler arquivo setup.sql");
    }

    echo "<div class='info'>✓ Arquivo setup.sql carregado</div>";

    // Executar SQL
    if ($conn->multi_query($sql)) {
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->next_result());
    }

    if ($conn->error) {
        throw new Exception("Erro ao executar SQL: " . $conn->error);
    }

    echo "<div class='success'>✓ Banco de dados 'ecommerce' criado com sucesso!</div>";
    echo "<div class='success'>✓ Tabelas 'usuarios' e 'produtos' criadas!</div>";
    echo "<div class='success'>✓ Produtos de exemplo inseridos!</div>";

    // Verificar dados
    $conn->select_db('ecommerce');
    $result = $conn->query("SELECT COUNT(*) as total FROM produtos");
    $row = $result->fetch_assoc();
    $totalProdutos = $row['total'];

    $result = $conn->query("SELECT COUNT(*) as total FROM usuarios");
    $row = $result->fetch_assoc();
    $totalUsuarios = $row['total'];

    echo "<h2>📊 Estatísticas do Banco</h2>";
    echo "<div class='info'><strong>Total de Produtos:</strong> $totalProdutos</div>";
    echo "<div class='info'><strong>Total de Usuários:</strong> $totalUsuarios</div>";

    echo "<h2>👤 Usuário de Teste</h2>";
    echo "<pre>
Email: admin@techhub.com
Senha: password
</pre>";

    echo "<h2>✅ Setup Concluído!</h2>";
    echo "<p><a href='index.html' style='background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Ir para o Site</a></p>";

    $conn->close();

} catch (Exception $e) {
    echo "<div class='error'>❌ ERRO: " . $e->getMessage() . "</div>";
    echo "<p>Certifique-se de que o MySQL está rodando no XAMPP.</p>";
}

echo "</body></html>";
?>