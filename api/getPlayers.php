<?php

header("Content-Type: application/json");

$file = "../data/players.json";

if (!file_exists($file)) {
    file_put_contents($file, "[]");
}

$data = file_get_contents($file);

if (!$data) {
    $data = "[]";
}

$json = json_decode($data, true);

if ($json === null) {
    $data = "[]";
}

echo $data;