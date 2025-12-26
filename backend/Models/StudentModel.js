const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    BatchCode: String,
    feeStatus: {
        type: Boolean,
        default:true
    },
    dropOut: {
        type: Boolean,
        default:false
    },
});

const studentModel = new mongoose.model("Students", studentSchema);

module.exports = studentModel;