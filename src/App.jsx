import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Index";
import EventDetails from "./components/EventDetails.jsx";
import BookingContext from "./components/EventBooking/BookingContext.jsx";
import EventBooking from "./components/EventBooking/EventBooking.jsx";
import PaymentSuccess from "./components/EventBooking/PaymentSuccess.jsx";
import CartProvider from "./components/Merch/CartProvider.jsx";
import Store from "./components/Merch/Store.jsx";
import ProductDetails from "./components/Merch/ProductDetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:eventId" element={<EventDetails />} />

      <Route
        path="/:eventId/checkout"
        element={
          <BookingContext>
            <EventBooking />
          </BookingContext>
        }
      />
      <Route
        path="/:eventId/checkout/payment-success"
        element={
          <BookingContext>
            <PaymentSuccess />
          </BookingContext>
        }
      />
      <Route
        path="/:eventId/merch"
        element={
          <CartProvider>
            <Store />
          </CartProvider>
        }
      />
      <Route
        path="/:eventId/merch/:productId/:itemId"
        element={
          <CartProvider>
            <ProductDetails />
          </CartProvider>
        }
      />
    </Routes>
  );
}

export default App;
