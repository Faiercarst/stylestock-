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

$user = $_GET['usuario_id'];

if (!$user) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT * FROM prendas WHERE usuario_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user);
$stmt->execute();

$res  = $stmt->get_result();
$data = [];

while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>