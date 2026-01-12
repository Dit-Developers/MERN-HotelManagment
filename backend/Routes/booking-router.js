const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/booking-controller');


router.post("/create-booking", bookingController.createBooking);
router.get("/all-bookings", bookingController.getAllBookings);
router.get("/single-booking/:bookingId", bookingController.getSingleBookingDetails);
router.put("/update-booking-status/:bookingId", bookingController.updateBookingStatus);

module.exports = router;