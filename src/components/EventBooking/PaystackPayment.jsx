import React from "react";

const PaystackPayment = () => {
  const handlePaystackPayment = () => {
    const handler = window.PaystackPop.setup({
      key: "YOUR_PUBLIC_KEY", // Replace with your Paystack public key
      email: email,
      amount: amount * 100, // Paystack accepts amounts in kobo (1 Naira = 100 Kobo)
      currency: "NGN", // Nigerian Naira
      ref: `ticket_${ticketId}_${new Date().getTime()}`, // Generate a reference
      onClose: () => {
        alert("Payment window closed");
      },
      callback: function (response) {
        // Verify payment using Paystack response
        alert(`Payment complete! Reference: ${response.reference}`);
        // Send this reference to your backend for verification and further processing
        verifyPayment(response.reference);
      },
    });

    handler.openIframe();
  };

  const verifyPayment = (reference) => {
    // You will typically send the reference to your backend to verify the payment
    // Backend should make a request to Paystack's verification endpoint:
    // GET https://api.paystack.co/transaction/verify/{reference}
    console.log("Verifying payment for reference:", reference);
    // Call your backend API here with the reference
  };
  return (
    <div>
      <button onClick={handlePaystackPayment}>Pay Now</button>
    </div>
  );
};

export default PaystackPayment;
