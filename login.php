<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

// leer datos
$data = json_decode(file_get_contents("php://input"), true);

// validar que llegue info
if(!$data){
    echo json_encode([
        "success" => false,
        "error" => "No se recibieron datos"
    ]);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if(!$email || !$password){
    echo json_encode([
        "success" => false,
        "error" => "Campos vacíos"
    ]);
    exit;
}

// buscar usuario
$sql = "SELECT * FROM usuarios WHERE email=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s",$email);
$stmt->execute();

$result = $stmt->get_result();

if($user = $result->fetch_assoc()){

    if(password_verify($password, $user['password'])){
        echo json_encode([
            "success"=>true,
            "user_id"=>$user['id'],
            "nombre"=>$user['nombre'],
            "apellido"=>$user['apellido'],
            "email"=>$user['email']
        ]);
    }else{
        echo json_encode(["success"=>false]);
    }

}else{
    echo json_encode(["success"=>false]);
}