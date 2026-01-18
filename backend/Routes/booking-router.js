const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/booking-controller');
const authenticateJWT = require('../Middlewares/authenticationMiddleware');
const authorizeRole = require('../Middlewares/authorizeMiddleware');

router.post(
  "/create-booking",
  authenticateJWT,
  authorizeRole('guest', 'user', 'receptionist', 'admin', 'manager', 'staff'),
  bookingController.createBooking
);

router.get(
  "/all-bookings",
  authenticateJWT,
  authorizeRole('admin', 'manager', 'receptionist', 'staff'),
  bookingController.getAllBookings
);

router.get(
  "/single-booking/:bookingId",
  authenticateJWT,
  authorizeRole('admin', 'manager', 'receptionist', 'guest', 'user', 'staff'),
  bookingController.getSingleBookingDetails
);

router.get(
  "/my-bookings",
  authenticateJWT,
  authorizeRole('guest', 'user', 'staff'),
  bookingController.getMyBookings
);

router.put(
  "/update-booking-status/:bookingId",
  authenticateJWT,
  authorizeRole('admin', 'manager', 'receptionist'),
  bookingController.updateBookingStatus
);

module.exports = router;
