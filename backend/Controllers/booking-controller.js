const bookingModel = require('../Models/BookingModel');

const createBooking = async (req, res) => {
    try {
        const { guestId, roomId, bookingDate, checkinDate, checkoutDate, bookingStatus } = req.body;

        let effectiveGuestId = guestId;
        if (req.user && req.user.role === 'guest') {
            effectiveGuestId = req.user._id;
        }

        const findAnExistingBooking = await bookingModel.findOne({ guestId: effectiveGuestId, roomId: roomId });
        if (findAnExistingBooking) { return res.status(400).json({ message: "Booking already exists" }); }

        const booking = await bookingModel.create({
            guestId: effectiveGuestId, roomId, bookingDate, checkinDate, checkoutDate, bookingStatus
        });

        if (booking) {
            return res.status(200).json({ message: "Booking has been created successfully", booking });
        }


    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });

    }
}


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

const getSingleBookingDetails = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const findBooking = await bookingModel.findOne({ _id: bookingId });
        if (!findBooking) { return res.status(404).json({ message: "Booking not found" }); }

        if (req.user && req.user.role === 'guest') {
            if (!findBooking.guestId || String(findBooking.guestId) !== String(req.user._id)) {
                return res.status(403).json({ message: "Forbidden. You can only view your own bookings" });
            }
        }

        return res.status(200).json({ message: "Here is your booking details", findBooking });
    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}


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

const getMyBookings = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;
        const bookings = await bookingModel.find({ guestId: userId });

        return res.status(200).json({ message: "User bookings found", bookings: bookings || [] });
    } catch (error) {
        console.error("Server error", error);
        return res.status(400).json({ message: "Server error", error });
    }
}

module.exports = { createBooking, getAllBookings, getSingleBookingDetails, updateBookingStatus, getMyBookings };
