<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "No se recibieron datos"]);
    exit;
}

$usuario_id      = $data['usuario_id'];
$prenda_id       = $data['prenda_id'];
$nombre_cliente  = $data['nombre_cliente'];
$documento       = $data['documento_cliente'];
$cantidad        = $data['cantidad_vendida'];
$precio_unitario = $data['precio_unitario'];
$total           = $data['total'];

// Verificar que hay suficiente stock
$check = $conn->prepare("SELECT cantidad FROM prendas WHERE id=?");
$check->bind_param("i", $prenda_id);
$check->execute();
$res = $check->get_result()->fetch_assoc();

if (!$res) {
    echo json_encode(["success" => false, "error" => "Prenda no encontrada"]);
    exit;
}

if ($res['cantidad'] < $cantidad) {
    echo json_encode(["success" => false, "error" => "Stock insuficiente. Solo hay " . $res['cantidad'] . " unidades"]);
    exit;
}

// Guardar la venta
$sql  = "INSERT INTO ventas(usuario_id, prenda_id, nombre_cliente, documento_cliente, cantidad_vendida, precio_unitario, total) VALUES(?,?,?,?,?,?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iissidd", $usuario_id, $prenda_id, $nombre_cliente, $documento, $cantidad, $precio_unitario, $total);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => $stmt->error]);
    exit;
}

$venta_id = $conn->insert_id;

// Descontar stock
$update = $conn->prepare("UPDATE prendas SET cantidad = cantidad - ? WHERE id = ?");
$update->bind_param("ii", $cantidad, $prenda_id);
$update->execute();

echo json_encode([
    "success"  => true,
    "venta_id" => $venta_id
]);
?>