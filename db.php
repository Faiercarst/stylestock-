<?php
$conn = new mysqli("localhost","root","","stylestock");
$conexion = $conn;

if($conn->connect_error){
    die("Error: " . $conn->connect_error);
}
?>