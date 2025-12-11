import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Index";
import Signup from "./components/Affiliate/Signup.jsx";
import Login from "./components/Affiliate/Login.jsx";
import AffiliateDashboard from "./components/Affiliate/AffiliateDashboard.jsx";
import EventDetails from "./components/EventDetails.jsx";
import BookingContext from "./components/EventBooking/BookingContext.jsx";
import EventBooking from "./components/EventBooking/EventBooking.jsx";
import PaymentSuccess from "./components/EventBooking/PaymentSuccess.jsx";
import RegisterSuccess from "./components/EventBooking/RegisterSuccess.jsx";
import MerchPaymentSuccess from "./components/Merch/MerchPaymentSuccess.jsx";
import CartProvider from "./components/Merch/CartProvider.jsx";
import Cart from "./components/Merch/Cart.jsx";
import CheckoutForm from "./components/Merch/CheckoutForm.jsx";
import Store from "./components/Merch/Store.jsx";
import ProductDetails from "./components/Merch/ProductDetails.jsx";
import Dashboard from "./components/Overview/Dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/affiliate/signup" element={<Signup />} />
      <Route path="/affiliate/login" element={<Login />} />
      <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
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
        path="/:eventId/checkout/register-success"
        element={
          <BookingContext>
            <RegisterSuccess />
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
      <Route
        path="/:eventId/merch/cart"
        element={
          <CartProvider>
            <Cart />
          </CartProvider>
        }
      />
      <Route
        path="/:eventId/merch/checkout"
        element={
          <CartProvider>
            <CheckoutForm />
          </CartProvider>
        }
      />
      <Route
        path="/:eventId/merch/checkout/payment-success"
        element={
          <CartProvider>
            <MerchPaymentSuccess />
          </CartProvider>
        }
      />
      <Route path="manage/:eventId" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
