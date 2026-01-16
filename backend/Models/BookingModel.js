// REFERENTIAL INTEGRITY
// NEW CONCEPT HERE OF REFERENCES / NORMALIZATION
const mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    guestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
    },
    bookingDate:{
        type: Date,
    },
    checkinDate:{
        type:Date
    },
    checkoutDate:{
        type:Date
    },
    bookingStatus:{
        type:String,
        enum:['cancelled', 'pending', 'confirmed', 'checked-in', 'checked-out']
    }

});

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;