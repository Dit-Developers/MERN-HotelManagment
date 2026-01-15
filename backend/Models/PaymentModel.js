const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentMethod: {  // FIXED: Changed from 'psymentMethod' to 'paymentMethod'
        type: String,
        enum: ['cash', 'card', 'cheque', 'credit_card', 'debit_card', 'online'], // Added more options
        required: true
    },
    cardType: {
        type: String
    },
    cardNumber: {
        type: String
    },
    cardCVC: {
        type: Number
    },
    cardExpiryDate: {
        type: String  // Changed from Date to String (like "12/25")
    },
    cardHolderName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD',  // Changed to uppercase
        enum: ['USD', 'EUR', 'GBP', 'PKR']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'], // Changed 'succeeded' to 'completed'
        default: 'pending'
    }
}, { 
    timestamps: true  // This will auto-create createdAt and updatedAt
});

const paymentModel = mongoose.model("Payments", paymentSchema);
module.exports = paymentModel;