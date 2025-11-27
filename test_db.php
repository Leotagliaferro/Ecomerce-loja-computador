<?php
try {
    $conn = new mysqli('localhost', 'root', '', 'ecommerce');

    if ($conn->connect_error) {
        echo "Connection failed: " . $conn->connect_error . "\n";
        exit(1);
    }

    echo "Database connection successful!\n";

    
    $result = $conn->query("SHOW TABLES LIKE 'usuarios'");
    if ($result->num_rows > 0) {
        echo "Table 'usuarios' exists\n";

        
        $result = $conn->query("DESCRIBE usuarios");
        echo "\nTable structure:\n";
        while ($row = $result->fetch_assoc()) {
            echo "- " . $row['Field'] . " (" . $row['Type'] . ")\n";
        }
    } else {
        echo "Table 'usuarios' does NOT exist!\n";
    }

    $conn->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>