const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    Email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    Password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
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
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10,15}$/, "Please provide a valid phone number"]
    },
    Address: {
        type: String,
        default: ""
    },
    HotelId: {
        type: String,
        default: "LUX001"
    },
    LastLogin: {
        type: Date
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
    Preferences: {
        type: Object,
        default: {}
    }
});

// SIMPLIFIED: Hash password without using 'next' parameter
userSchema.pre("save", async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("Password")) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
    } catch (error) {
        throw error;
    }
});

// SIMPLIFIED: Update UpdatedAt without 'next'
userSchema.pre("save", function() {
    this.UpdatedAt = Date.now();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.Password);
    } catch (error) {
        throw error;
    }
};

// Get safe user object (without password)
userSchema.methods.toSafeObject = function() {
    const userObject = this.toObject();
    delete userObject.Password;
    return userObject;
};

// Find user by email with password
userSchema.statics.findByEmailWithPassword = function(email) {
    return this.findOne({ Email: email }).select("+Password");
};

const User = mongoose.model("Users", userSchema);

module.exports = User;