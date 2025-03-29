<?php
require_once '../server/db.php';

// Obtener el contenido del carrito desde el cuerpo de la solicitud
$cart = json_decode(file_get_contents('php://input'), true);

if (!$cart || empty($cart)) {
    http_response_code(400);
    echo json_encode(['error' => 'Carrito vacío o inválido']);
    exit();
}

$error = false;
$conn->begin_transaction();

try {
    foreach ($cart as $id => $item) {
        $cantidadComprada = $item['cantidad'];

        // Consultar la existencia actual del producto
        $stmt = $conn->prepare("SELECT existencia FROM products WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($existenciaActual);
        $stmt->fetch();
        $stmt->close();

        // Verificar si hay suficiente stock
        if ($existenciaActual >= $cantidadComprada) {
            // Actualizar el stock del producto
            $nuevaExistencia = $existenciaActual - $cantidadComprada;

            $stmt = $conn->prepare("UPDATE products SET existencia = ? WHERE id = ?");
            $stmt->bind_param("ii", $nuevaExistencia, $id);
            $stmt->execute();
            $stmt->close();
        } else {
            $error = true;
            break;
        }
    }

    if ($error) {
        $conn->rollback();
        http_response_code(400);
        echo json_encode(['error' => 'Stock insuficiente para uno o más productos']);
    } else {
        $conn->commit();
        echo json_encode(['success' => 'Pedido guardado exitosamente']);
    }
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error al guardar el pedido']);
}

$conn->close();
