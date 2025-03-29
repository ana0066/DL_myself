<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Obtener los datos del request
$data = json_decode(file_get_contents("php://input"), true);

// Verifica que se hayan recibido datos
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos']);
    exit;
}


include 'db.php';

$nombre = $data['nombre'];
$valor = $data['valor'];
$existencia = $data['existencia'];
$urlImagen = $data['urlImagen'];

// Inserción en la base de datos
$sql = "INSERT INTO products (nombre, valor, existencia, urlImagen) VALUES (?,?,?,?)";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute([$nombre, $valor, $existencia, $urlImagen]);

echo json_encode(['success' => $result]);
?>
