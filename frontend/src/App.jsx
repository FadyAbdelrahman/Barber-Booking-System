import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";

import Home from "./pages/Home.jsx";
import ServicesCatalogue from "./pages/ServicesCatalogue.jsx";
import ServiceDetails from "./pages/ServiceDetails.jsx";

import Book from "./pages/Book.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminManageSlots from "./pages/AdminManageSlots.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/services" element={<ServicesCatalogue />} />
        <Route path="/services/:id" element={<ServiceDetails />} />

        <Route path="/book" element={<Book />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/manage-slots" element={<AdminManageSlots />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
