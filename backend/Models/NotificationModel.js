const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['booking', 'maintenance', 'system', 'service', 'payment'],
        required: true
    },
    recipientRole: {
        type: String,
        enum: ['admin', 'manager', 'reception', 'receptionist', 'staff', 'guest', 'all'],
        default: 'admin'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    referenceId: { // ID of the booking/request
        type: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
