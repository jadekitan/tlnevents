CREATE TABLE orders (
    order_id VARCHAR(5) PRIMARY KEY,  -- Unique order ID
    email VARCHAR(255) NOT NULL,       -- Email of the user
    name VARCHAR(255) NOT NULL,        -- Full name of the user
    amount DECIMAL(10, 2) NOT NULL,    -- Total amount for the order
    ticket_type VARCHAR(255) NOT NULL, -- Ticket type (e.g., VIP, Regular)
    quantity INT NOT NULL,             -- Quantity of tickets
    date_created DATETIME NOT NULL     -- Order creation timestamp
);
