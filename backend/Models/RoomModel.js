const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    RoomNumber: String,
    Type: {
        type: String,
        enum: ["standard", "deluxe", "suite"]
    },
    Price: Number,
    Capacity: Number,
    Amenities: [String],
    Floor: Number,
    Status: {
        type: String,
        default: "available"
    }
});

const roomModel = new mongoose.model("Rooms", roomSchema);

module.exports = roomModel;
