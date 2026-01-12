const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String
    },
    roomType: {
        type: String
    },
    floor: {
        type: String
    },
    bedCount: {
        type: Number
    },
    hasAC: {
        type: Boolean
    },
    hasWIFI: {
        type: Boolean
    },
    hasTV: {
        type: String,
    },
    pricePerNight: {
        type: String
    },
    isAvailable: {
        type: Boolean
    },
    roomStatus: {
        type: String,
        enum: ["available", "booked", "under maintenance", "cleaning"],
        default: "available"
    }
})

const roomModel = mongoose.model("Room", roomSchema);

module.exports = roomModel;