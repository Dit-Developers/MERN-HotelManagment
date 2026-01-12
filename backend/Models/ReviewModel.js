const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    remarks:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

const reviewModel = mongoose.model("Reviews", reviewSchema);


module.exports = reviewModel;