const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    GuestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    RoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rooms"
    },
    CheckInDate: Date,
    CheckOutDate: Date,
    ActualCheckIn: Date,
    ActualCheckOut: Date,
    Status: {
        type: String,
        default: "reserved"
    }
});

const bookingModel = new mongoose.model("Bookings", bookingSchema);

module.exports = bookingModel;
