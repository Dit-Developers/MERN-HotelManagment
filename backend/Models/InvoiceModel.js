const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    BookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings"
    },
    GuestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    Items: [
        {
            Description: String,
            Amount: Number
        }
    ],
    Tax: Number,
    Discount: Number,
    TotalAmount: Number,
    PaymentStatus: {
        type: String,
        default: "pending"
    }
});

const invoiceModel = new mongoose.model("Invoices", invoiceSchema);

module.exports = invoiceModel;
