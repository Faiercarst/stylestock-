<?php
// CORS headers - deben ir PRIMERO antes de todo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['nombre'], $data['apellido'], $data['email'], $data['password'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$nombre   = $data['nombre'];
$apellido = $data['apellido'];
$email    = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$sql  = "INSERT INTO usuarios(nombre, apellido, email, password) VALUES(?,?,?,?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error prepare: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssss", $nombre, $apellido, $email, $password);

try{

   if ($stmt->execute()) {
    echo json_encode(["success" => true]);
   }
} catch (mysqli_sql_exception $e) {
    if ($conn ->errno === 1062) {

        echo json_encode(["success" => false, "error" => "El correo ya está registrado"]);
    } else {
        echo json_encode(["success" => false, "error" =>  $e->getMessage()]);
    }

}
?>

