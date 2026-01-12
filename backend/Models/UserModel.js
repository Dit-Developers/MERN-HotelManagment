const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    Password: {
        type: String,
        required: true,
        minlength: 6
    },
    Role: {
        type: String,
        enum: ["admin", "manager", "receptionist", "housekeeping", "guest"],
        default: "guest"
    },
    Status: {
        type: Boolean,
        default: true
    },
    Phone: {
        type: String,
        trim: true
    },
    Address: {
        type: String,
        trim: true
    },
    Preferences: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt field on update operations
userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Method to remove password from JSON output
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.Password;
    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;