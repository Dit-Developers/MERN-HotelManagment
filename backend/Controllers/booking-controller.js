const bookingModel = require('../Models/BookingModel');

// create booking API 
const createBooking = async (req, res) => {
    try {
        const { guestId, roomId, bookingDate, checkinDate, checkoutDate, bookingStatus } = req.body;

        const findAnExistingBooking = await bookingModel.findOne({ guestId: guestId, roomId: roomId });
        if (findAnExistingBooking) { return res.status(400).json({ message: "Booking already exists" }); }

        const booking = await bookingModel.create({
            guestId, roomId, bookingDate, checkinDate, checkoutDate, bookingStatus
        });

        if (booking) {
            return res.status(200).json({ message: "Booking has been created successfully", booking });
        }


    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });

    }
}


// GET all bookings API
const getAllBookings = async (req, res) => {
    try {
        const allBookings = await bookingModel.find();
        if (!allBookings) { return res.status(404).json({ message: "No bookings found" }); }
        return res.json({ message: "All bookings found", allBookings });

    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}

// GET Single Booking details API

const getSingleBookingDetails = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const findBooking = await bookingModel.findOne({ _id: bookingId });
        if (!findBooking) { return res.status(404).json({ message: "Booking not found" }); }
        return res.status(200).json({ message: "Here is your booking details", findBooking });
    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}


// Update booking status API
const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const findBooking = await bookingModel.findById(bookingId);
        if (!findBooking) { return res.status(404).json({ message: "No booking found" }); }
        const { bookingStatus } = req.body;
        const findAbookingAndUpdate = await bookingModel.findByIdAndUpdate(bookingId, { bookingStatus: bookingStatus }, {new: true});
        if (!findAbookingAndUpdate) { return res.status(404).json({ message: "An error while updating the status" }); }

        return res.status(200).json({ message: "Status has been updated", findAbookingAndUpdate });
    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}

module.exports = { createBooking, getAllBookings, getSingleBookingDetails, updateBookingStatus };