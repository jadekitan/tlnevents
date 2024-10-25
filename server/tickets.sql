CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(5) NOT NULL,     -- Order ID associated with the ticket
    ticket_type VARCHAR(255) NOT NULL, -- The type of ticket (e.g., VIP, Regular)
    quantity INT NOT NULL,             -- Quantity of tickets
    price DECIMAL(10, 2) NOT NULL,     -- Price per ticket
    fees DECIMAL(10, 2) NOT NULL,      -- Additional fees for the ticket
    subtotal DECIMAL(10, 2) NOT NULL,  -- Subtotal (price * quantity)
    total DECIMAL(10, 2) NOT NULL,     -- Total (subtotal + fees)
    CONSTRAINT fk_order_id_tickets FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);
