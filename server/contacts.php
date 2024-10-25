<?php
// Allow CORS from localhost during development
header('Access-Control-Allow-Origin: http://localhost:5175');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS request for preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200); // Preflight request success
  exit();
}

// Disable error output for production
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Set response header to JSON
header('Content-Type: application/json; charset=utf-8');

// Get the input JSON data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if the required fields are present
if (!isset($data['tickets']) || !is_array($data['tickets'])) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid input: tickets data is missing or improperly formatted.',
  ]);
  exit();
}

// Database connection parameters
$host = 'localhost';
$db = 'u508107408_lemonade';
$user = 'u508107408_root';
$pass = 'Ignorance@001';
$charset = 'utf8mb4';

try {
  // Create a connection
  $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
  $options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
  ];
  $pdo = new PDO($dsn, $user, $pass, $options);

  // Start a transaction to ensure all contacts are added or rolled back if one fails
  $pdo->beginTransaction();

  // Loop through each ticket and save contact information
  foreach ($data['tickets'] as $ticket) {
    // Ensure each ticket has the required fields
    if (!isset($ticket['firstName']) || !isset($ticket['lastName']) || !isset($ticket['email']) || !isset($ticket['phone'])) {
      echo json_encode([
        'success' => false,
        'message' => 'Required fields are missing for one or more tickets.',
      ]);
      exit();
    }

    $name = $ticket['firstName'] . ' ' . $ticket['lastName'];

    // Check for existing contact with the same email or phone number
    $sql = "SELECT COUNT(*) FROM contacts WHERE email = :email OR phone = :phone";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':email' => $ticket['email'],
      ':phone' => $ticket['phone'],
    ]);

    $count = $stmt->fetchColumn();

    if ($count > 0) {
      echo json_encode([
        'success' => false,
        'message' => 'Contact with the same email or phone number already exists: ' . $ticket['email'] . ' or ' . $ticket['phone'],
      ]);
      $pdo->rollBack(); // Rollback the transaction if any contact already exists
      exit();
    }

    // Insert contact information into the database
    $sql = "INSERT INTO contacts (name, email, phone) VALUES (:name, :email, :phone)";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([
      ':name' => $name,
      ':email' => $ticket['email'],
      ':phone' => $ticket['phone'],
    ])) {
      echo json_encode(['success' => false, 'message' => 'Failed to save contact for ticket: ' . $name]);
      $pdo->rollBack(); // Rollback the transaction if any insertion fails
      exit();
    }
  }

  // Commit the transaction if all contacts were saved successfully
  $pdo->commit();

  echo json_encode(['success' => true, 'message' => 'All contacts saved successfully.']);
} catch (PDOException $e) {
  // Rollback the transaction in case of a database error
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  echo json_encode([
    'success' => false,
    'message' => 'Database error: ' . $e->getMessage(),
  ]);
} catch (Exception $e) {
  echo json_encode([
    'success' => false,
    'message' => 'Unexpected error: ' . $e->getMessage(),
  ]);
}
