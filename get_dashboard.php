<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$user_id = $_GET['usuario_id'];

if(!$user_id){
    echo json_encode(["success" => false, "error" => "ID no recibido"]);
    exit;
}

// Total prendas
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM prendas WHERE usuario_id=?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$totalPrendas = $stmt->get_result()->fetch_assoc()['total'];

// Total stock
$stmt = $conn->prepare("SELECT SUM(cantidad) as total FROM prendas WHERE usuario_id=?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$totalStock = $stmt->get_result()->fetch_assoc()['total'];

// Valor inventario
$stmt = $conn->prepare("SELECT SUM(precio * cantidad) as total FROM prendas WHERE usuario_id=?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$totalValor = $stmt->get_result()->fetch_assoc()['total'];

// Prendas por categoría
$stmt = $conn->prepare("SELECT categoria, COUNT(*) as total FROM prendas WHERE usuario_id=? GROUP BY categoria");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$categorias = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Stock por prenda
$stmt = $conn->prepare("SELECT nombre, cantidad FROM prendas WHERE usuario_id=?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stockPrendas = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success"      => true,
    "totalPrendas" => $totalPrendas,
    "totalStock"   => $totalStock,
    "totalValor"   => $totalValor,
    "categorias"   => $categorias,
    "stockPrendas" => $stockPrendas
]);
?>