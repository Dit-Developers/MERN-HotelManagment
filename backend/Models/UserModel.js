const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Role: {
        type: String,
        enum: ["admin", "manager", "receptionist", "housekeeping", "guest"]
    },
    Status: {
        type: Boolean,
        default: true
    },
    Phone: String,
    Address: String,
    Preferences: Object
});

const userModel = new mongoose.model("Users", userSchema);

module.exports = userModel;
