const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    remarks: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const reviewModel = mongoose.model("Reviews", reviewSchema);


module.exports = reviewModel;
