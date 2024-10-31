<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$input = json_decode(file_get_contents('php://input'), true);
$reference = $input['reference'];

// Database connection
$host = 'localhost'; // Update with your database host
$db   = 'u508107408_root'; // Update with your database name
$user = 'your_username'; // Update with your database username
$pass = 'Ignorance@001'; // Update with your database password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
  throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Sample data (Replace with actual data from your request)
$orderData = [
  'order_id' => $_POST['order_id'], // Assuming this comes from your form
  'first_name' => $_POST['first_name'],
  'last_name' => $_POST['last_name'],
  'email' => $_POST['email'],
  'ticket_type' => $_POST['ticket_type'], // Get this from your input
  'quantity' => $_POST['quantity'], // Get this from your input
  'price' => $_POST['price'], // Get this from your input
  'subtotal' => $_POST['subtotal'], // Get this from your input
  'fees' => $_POST['fees'], // Get this from your input
  'total' => $_POST['total'], // Get this from your input
];

$sql = "INSERT INTO orders (order_id, first_name, last_name, email, ticket_type, quantity, price, subtotal, fees, total) 
        VALUES (:order_id, :first_name, :last_name, :email, :ticket_type, :quantity, :price, :subtotal, :fees, :total)";

$stmt = $pdo->prepare($sql);

try {
  $stmt->execute($orderData);
  echo "Order has been successfully created.";
} catch (PDOException $e) {
  echo "Error: " . $e->getMessage();
}
