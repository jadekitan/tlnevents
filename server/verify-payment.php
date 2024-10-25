<?php
// Allow CORS
header('Access-Control-Allow-Origin: http://localhost:5175');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

header('Content-Type: application/json');

// Paystack secret key
$paystackSecretKey = 'sk_test_f3619b33746f63edbc9ee5921ea409ead2a8b99f';

// Get the payment reference and selected tickets from the POST request
$input = json_decode(file_get_contents('php://input'), true);
$reference = isset($input['reference']) ? $input['reference'] : null;
$selectedTickets = isset($input['tickets']) ? $input['tickets'] : [];

if (!$reference) {
  echo json_encode([
    'success' => false,
    'message' => 'Payment reference is required'
  ]);
  exit();
}

// Verify payment with Paystack API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.paystack.co/transaction/verify/" . $reference);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Authorization: Bearer " . $paystackSecretKey
]);

$response = curl_exec($ch);
$transaction = json_decode($response, true);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Check if Paystack returned a valid response
if ($httpcode !== 200 || !$transaction['status']) {
  echo json_encode([
    'success' => false,
    'message' => 'Payment verification failed with Paystack'
  ]);
  exit();
}

// Check if payment is successful
if ($transaction['data']['status'] == 'success') {
  $amount = $transaction['data']['amount'] / 100; // Paystack returns amount in kobo, divide by 100
  $userEmail = $transaction['data']['customer']['email'];
  $fullName = $transaction['data']['customer']['first_name'] . " " . $transaction['data']['customer']['last_name'];

  // Generate unique order ID (5 characters)
  $orderId = generateUniqueOrderId(5);

  // Log the data for debugging
  error_log("Selected tickets: " . print_r($selectedTickets, true));
  error_log("Amount: " . $amount);

  // Database connection
  require_once 'db_connection.php';  // Include your PDO connection
  try {
    // Start transaction
    $pdo->beginTransaction();

    // Insert into orders table for each ticket type and quantity
    foreach ($selectedTickets as $ticket) {
      $ticketType = $ticket['name'];
      $quantity = $ticket['quantity'];
      $fees = $ticket['price'] * 0.10;
      $subtotal = $ticket['price'] * $quantity;
      $total = $subtotal + $fees;

      // Insert into orders table (one row per ticket type and quantity)
      $sql = "INSERT INTO orders (order_id, email, name, amount, ticket_type, quantity, date_created) 
              VALUES (:order_id, :email, :name, :amount, :ticket_type, :quantity, :date_created)";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([
        ':order_id' => $orderId,
        ':email' => $userEmail,
        ':name' => $fullName,
        ':amount' => $total,  // Total amount for the ticket type
        ':ticket_type' => $ticketType,
        ':quantity' => $quantity,
        ':date_created' => date('Y-m-d H:i:s')
      ]);

      // Insert into tickets table (one row for each ticket)
      $sql = "INSERT INTO tickets (order_id, ticket_type, quantity, price, fees, subtotal, total) 
              VALUES (:order_id, :ticket_type, :quantity, :price, :fees, :subtotal, :total)";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([
        ':order_id' => $orderId,
        ':ticket_type' => $ticketType,
        ':quantity' => $quantity,
        ':price' => $ticket['price'],
        ':fees' => $fees,
        ':subtotal' => $subtotal,
        ':total' => $total
      ]);
    }

    // Insert payment information into payments table after all tickets/orders
    $sql = "INSERT INTO payments (order_id, payment_reference, amount, payment_status) 
            VALUES (:order_id, :payment_reference, :amount, :payment_status)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
      ':order_id' => $orderId,
      ':payment_reference' => $reference,
      ':amount' => $amount,  // Total amount of the payment
      ':payment_status' => $transaction['data']['status']
    ]);

    // Commit the transaction
    $pdo->commit();

    echo json_encode([
      'success' => true,
      'message' => 'Order, payment, and tickets saved successfully',
      'order_id' => $orderId
    ]);
  } catch (PDOException $e) {
    // Rollback transaction in case of an error
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    error_log("Database error: " . $e->getMessage());
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Payment verification failed']);
}

// Function to generate unique order ID
function generateUniqueOrderId($length = 5)
{
  $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return substr(str_shuffle($characters), 0, $length);
}
