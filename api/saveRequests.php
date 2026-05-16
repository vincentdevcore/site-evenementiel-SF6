<?php

session_start();

if (
    !isset($_SESSION["admin_logged"]) ||
    $_SESSION["admin_logged"] !== true
) {
    http_response_code(403);
    exit;
}

header("Content-Type: application/json");

$file = "../data/requests.json";

$data = file_get_contents("php://input");

file_put_contents($file, $data);

echo json_encode([
    "success" => true
]);