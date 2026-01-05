const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../Models/UserModel");

const bcrypt = require("bcrypt");


// POST /users/Register

router.post("/Register", async (req, res) => {
    try {
        const { Name, Email, Password, Role, Phone, Address } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Create user
        const user = await User.create({
            Name,
            Email,
            Password: hashedPassword,
            Role,
            Phone,
            Address
        });

        return res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// POST /users/Login

router.post("/Login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.Role,
                email: user.Email
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.json({
            message: "Login successful",
            user,
            token
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// PUT /users/Update/:id
router.put("/Update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Email, Password, Role, Phone, Address } = req.body;

        const updateData = { Name, Email, Role, Phone, Address };

        // Hash password if provided
        if (Password) {
            const saltRounds = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, saltRounds);
            updateData.Password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /users/Delete/:id
router.delete("/Delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
