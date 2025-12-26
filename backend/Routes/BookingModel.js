const express = require("express");
const router = express.Router();
const Booking = require("../Models/BookingModel");

// CREATE BOOKING
router.post("/create", async (req, res) => {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
});

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
    res.json(await Booking.find().populate("GuestId RoomId"));
});

// UPDATE BOOKING STATUS
router.put("/:id", async (req, res) => {
    res.json(await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

module.exports = router;
