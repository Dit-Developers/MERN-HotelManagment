const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['room_cleaning', 'food_service', 'laundry', 'maintenance', 'wakeup_call', 'transport', 'housekeeping' ,'room_service','other',]
  },
  description: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in_progress', 'completed', 'cancelled']
  },
  priority: {
    type: String,
    default: 'normal',
    enum: ['low', 'normal', 'high', 'urgent']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String
  }
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest;