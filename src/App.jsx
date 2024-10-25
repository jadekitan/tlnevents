import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Index";
import EventDetails from "./components/EventDetails.jsx";
import BookingContext from "./components/EventBooking/BookingContext.jsx";
import EventBooking from "./components/EventBooking/EventBooking.jsx";
import PaymentSuccess from "./components/EventBooking/PaymentSuccess.jsx";

function App() {
  return (
    <BookingContext>
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
          element={<PaymentSuccess />}
        />
      </Routes>
    </BookingContext>
  );
}

export default App;
