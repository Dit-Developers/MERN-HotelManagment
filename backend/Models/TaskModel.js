const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    RoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rooms"
    },
    ReportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    AssignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    Type: String, // housekeeping, maintenance
    Description: String,
    Status: {
        type: String,
        default: "pending"
    }
});

const taskModel = new mongoose.model("Tasks", taskSchema);

module.exports = taskModel;
