const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
    GuestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    BookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings"
    },
    ServiceType: String,
    Details: String,
    Status: {
        type: String,
        default: "requested"
    }
});

const serviceRequestModel = new mongoose.model("ServiceRequests", serviceRequestSchema);

module.exports = serviceRequestModel;
