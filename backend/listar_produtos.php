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