<?php
header('Content-Type: application/json');

// Get the raw POST data from Paystack
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verify the webhook (check if it's coming from Paystack)
// You might want to verify the signature to ensure it's a genuine Paystack request

// Check if the payment was successful
if ($data['event'] == 'charge.success') {
  $order_id = $data['data']['id']; // Paystack order ID
  $amount = $data['data']['amount']; // Amount in kobo
  $customer_email = $data['data']['customer']['email']; // Customer email
  $customer_name = $data['data']['customer']['name']; // Customer name

  // Get ticket details from your database or directly from the request if needed
  // For this example, we assume you have ticket details stored somewhere
  $ticketType = 'Sample Ticket Type'; // This should be dynamically retrieved
  $quantity = 2; // This should be dynamically retrieved
  $fees = 500; // This should be dynamically retrieved
  $subtotal = $quantity * $fees;
  $total = $amount / 100; // Convert kobo to Naira

  // Save order information to the database
  try {
    // Database connection code here
    $pdo = new PDO($dsn, $user, $pass, $options);

    $sql = "INSERT INTO orders (contact_id, ticket_type, quantity, fees, subtotal, total, order_id) 
                VALUES (:contact_id, :ticket_type, :quantity, :fees, :subtotal, :total, :order_id)";
    $stmt = $pdo->prepare($sql);

    // Assuming you have a way to link the order to a contact, perhaps by email
    // $contactId = getContactIdByEmail($customer_email); // Create this function to fetch contact ID

    if ($stmt->execute([
      ':contact_id' => $contactId,
      ':ticket_type' => $ticketType,
      ':quantity' => $quantity,
      ':fees' => $fees,
      ':subtotal' => $subtotal,
      ':total' => $total,
      ':order_id' => $order_id,
    ])) {
      // Order saved successfully
      // sendOrderConfirmationEmail($customer_email, $ticketType, $quantity, $total, $order_id); // Implement this function
      echo json_encode(['status' => 'success']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Failed to save order.']);
    }
  } catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
  }
} else {
  echo json_encode(['status' => 'ignored']);
}
