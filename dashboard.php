<?php

session_start();

if (
    !isset($_SESSION["admin_logged"]) ||
    $_SESSION["admin_logged"] !== true
) {
    header("Location: admin.php");
    exit;
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

    <link rel="stylesheet" href="./css/root.css" />
    <link rel="stylesheet" href="./css/base/global.css" />
    <link rel="stylesheet" href="./css/base/reset.css" />
    <link rel="stylesheet" href="./css/responsive.css" />
    <link rel="stylesheet" href="./css/admin/admin-layout.css" />
    <link rel="stylesheet" href="./css/admin/admin-dashboard.css" />
    <link rel="stylesheet" href="./css/admin/admin-cards.css" />
    <link rel="stylesheet" href="./css/admin/admin-buttons.css" />
    <link rel="stylesheet" href="./css/admin/admin-login.css" />
    <link rel="stylesheet" href="./css/admin/admin-animations.css" />
    <link rel="stylesheet" href="./css/responsive/admin-responsive.css" />
  
    <script defer src="./js/login.js"></script>
  
  </head>

  <body class="admin-page">
    <!-- =========================
         ADMIN DASHBOARD 
    ========================== -->

    <main class="admin-card">
      <h1>Panel Admin</h1>

     
    </main>
  </body>
</html>
