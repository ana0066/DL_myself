<?php
include 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];
$atributo = $data['atributo'];
$nuevoValor = $data['nuevoValor'];

// Actualización dinámica. IMPORTANTE: valida y restringe qué atributos se pueden actualizar.
$permitidos = ['nombre', 'valor', 'existencia', 'urlImagen'];
if (!in_array($atributo, $permitidos)) {
    echo json_encode(['success' => false, 'message' => 'Atributo no permitido']);
    exit;
}

$sql = "UPDATE products SET $atributo = ? WHERE nombre = ?";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute([$nuevoValor, $nombre]);

echo json_encode(['success' => $result]);
?>
