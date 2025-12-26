const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    InvoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoices"
    },
    Amount: Number,
    Method: String, // cash, card, online
    PaymentDate: {
        type: Date,
        default: Date.now
    }
});

const paymentModel = new mongoose.model("Payments", paymentSchema);

module.exports = paymentModel;
