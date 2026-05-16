<?php

session_start();

$error = "";

$adminUsername = "Kwerelsf6";
$adminPassword = "KwSFer6el#";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"] ?? "");
    $password = trim($_POST["password"] ?? "");

    if (
        $username === $adminUsername &&
        $password === $adminPassword
    ) {

        $_SESSION["admin_logged"] = true;

        header("Location: dashboard.php");
        exit;
    }

    $error = "Identifiants incorrects.";
}

?>

<!doctype html>
<html lang="fr">
  <head>
    <!-- =========================
         META
    ========================== -->

    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Admin</title>

    <!-- =========================
         GLOBAL CSS
    ========================== -->

    <link rel="stylesheet" href="./css/root.css" />

    <link rel="stylesheet" href="./css/base/global.css" />

    <link rel="stylesheet" href="./css/base/reset.css" />

    <link rel="stylesheet" href="./css/responsive.css" />

    <!-- =========================
         ADMIN CSS
    ========================== -->

    <link rel="stylesheet" href="./css/admin/admin-layout.css" />

    <link rel="stylesheet" href="./css/admin/admin-dashboard.css" />

    <link rel="stylesheet" href="./css/admin/admin-cards.css" />

    <link rel="stylesheet" href="./css/admin/admin-buttons.css" />

    <link rel="stylesheet" href="./css/admin/admin-login.css" />

    <link rel="stylesheet" href="./css/admin/admin-animations.css" />

    <link rel="icon" type="image/png" href="./img/favicon-kwerel.png" />

  <!-- <script defer src="./js/login.js"></script> -->
  </head>

  <body class="admin-page">
    <!-- =========================
         LOGIN CARD
    ========================== -->

    <main class="admin-card">
      <h1>Panel Admin</h1>

      <form
  method="POST"
  id="adminLoginForm"
  class="admin-form"
  autocomplete="off"
>
        <label>
          Nom d’utilisateur :

          <input type="text" name="username" required />
        </label>

        <label>
          Mot de passe :

          <input type="password" name="password" required />
        </label>

        <button type="submit" id="loginBtn">Se connecter</button>

        <p id="loginMessage" class="admin-message" aria-live="polite"></p>
      </form>

      <p class="admin-footer">
        Saisissez vos identifiants pour accéder aux contrôles.
      </p>
    </main>
  </body>
</html>
