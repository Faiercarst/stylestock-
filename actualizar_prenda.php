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

$id       = $data['id'];
$nombre   = $data['nombre'];
$categoria= $data['categoria'];
$talla    = $data['talla'];
$color    = $data['color'];
$precio   = $data['precio'];
$cantidad = $data['cantidad'];
$imagen   = $data['imagen'];

$sql = "UPDATE prendas SET nombre=?, categoria=?, talla=?, color=?, precio=?, cantidad=?, imagen=? WHERE id=?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit;
}

$stmt->bind_param("ssssdisi", $nombre, $categoria, $talla, $color, $precio, $cantidad, $imagen, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
?>