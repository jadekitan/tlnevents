<?php
// Database connection settings
$host = 'localhost';  // or the database host (e.g., '127.0.0.1')
$db = 'u508107408_lemonade';  // your database name
$user = 'u508107408_root';  // your database username
$pass = 'Ignorance@001';  // your database password
$charset = 'utf8mb4';  // character set

// Data Source Name (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // Error reporting
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  // Fetch associative arrays
  PDO::ATTR_EMULATE_PREPARES   => false,  // Use native prepared statements
];

try {
  // Create a new PDO instance
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
  // If there is an error, it will throw an exception and display an error message
  error_log("Database connection failed: " . $e->getMessage());
  echo json_encode(['success' => false, 'message' => 'Database connection failed']);
  exit();
}
