<?php
header('Access-Control-Allow-Origin: http://localhost:5175');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || !isset($data['attendeeAddresses'])) {
  echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
  exit();
}

$host = 'localhost';
$db = 'u508107408_lemonade';
$user = 'u508107408_root';
$pass = 'Ignorance@001';
$charset = 'utf8mb4';

try {
  $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
  $options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
  ];
  $pdo = new PDO($dsn, $user, $pass, $options);

  // Insert primary contact details
  $sql = "INSERT INTO contacts (name, email, phone) VALUES (:name, :email, :phone) ON DUPLICATE KEY UPDATE phone = :phone";
  $stmt = $pdo->prepare($sql);
  $name = $data['firstName'] . ' ' . $data['lastName'];
  $stmt->execute([
    ':name' => $name,
    ':email' => $data['email'],
    ':phone' => $data['phone'],
  ]);

  // Insert each attendee's details
  foreach ($data['attendeeAddresses'] as $ticketId => $attendees) {
    foreach ($attendees as $attendee) {
      $attendeeName = $attendee['firstName'] . ' ' . $attendee['lastName'];
      $attendeeEmail = $attendee['email'];

      // Check if attendee already exists
      $checkSql = "SELECT * FROM contacts WHERE email = :email";
      $checkStmt = $pdo->prepare($checkSql);
      $checkStmt->execute([':email' => $attendeeEmail]);
      $existingContact = $checkStmt->fetch();

      if ($existingContact) {
        // Update existing contact with attendee details
        $updateSql = "UPDATE contacts SET name = :name WHERE email = :email";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([':name' => $attendeeName, ':email' => $attendeeEmail]);
      } else {
        // Insert new attendee contact
        $insertSql = "INSERT INTO contacts (name, email, phone) VALUES (:name, :email, :phone)";
        $insertStmt = $pdo->prepare($insertSql);
        $insertStmt->execute([':name' => $attendeeName, ':email' => $attendeeEmail, ':phone' => $data['phone']]);
      }
    }
  }

  echo json_encode(['success' => true, 'message' => 'Contact and attendees saved successfully.']);
} catch (PDOException $e) {
  echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
