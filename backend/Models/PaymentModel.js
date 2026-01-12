const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    psymentMethod: {
        type: String,
        enum: ['cash', 'card', 'cheque']
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
        type: Date
    },
    cardHolderName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking'
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd',

    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'cancelled'],
        default: 'pending'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const paymentModel = mongoose.model("Payments", paymentSchema);

module.exports = paymentModel;