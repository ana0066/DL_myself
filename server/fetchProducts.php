<?php
include 'db.php';
header('Content-Type: application/json');

$sql = "SELECT * FROM products";
$stmt = $pdo->query($sql);
$productos = $stmt->fetchAll();

echo json_encode($productos);
?>
