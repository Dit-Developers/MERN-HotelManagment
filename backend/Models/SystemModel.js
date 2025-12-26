const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({
    Taxes: Number,
    Policies: String,
    Notifications: [
        {
            UserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            },
            Message: String,
            IsRead: {
                type: Boolean,
                default: false
            },
            CreatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const systemModel = new mongoose.model("System", systemSchema);

module.exports = systemModel;
