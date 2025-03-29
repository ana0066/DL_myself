<?php
include 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];

$sql = "DELETE FROM products WHERE nombre = ?";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute([$nombre]);

echo json_encode(['success' => $result]);
?>
