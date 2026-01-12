const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");

// Verify JWT Token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// POST /users/Register
router.post("/Register", async (req, res) => {
    try {
        const { Name, Email, Password, Role, Phone, Address } = req.body;

        // Validation
        if (!Email || !Password || !Name) {
            return res.status(400).json({ message: "Email, Password, and Name are required" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Create user
        const user = await User.create({
            Name,
            Email,
            Password: hashedPassword,
            Role: Role || "guest",
            Phone: Phone || "",
            Address: Address || ""
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.Role,
                email: user.Email
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role,
                Phone: user.Phone,
                Address: user.Address
            },
            token
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: error.message });
    }
});

// POST /users/Login
router.post("/Login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Validation
        if (!Email || !Password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        // Find user
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if user is active
        if (user.Status === false) {
            return res.status(403).json({ message: "Account is deactivated" });
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
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role,
                Phone: user.Phone,
                Address: user.Address,
                Status: user.Status
            },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: error.message });
    }
});

// POST /users/verify-token
router.post("/verify-token", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-Password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            valid: true,
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role,
                Phone: user.Phone,
                Address: user.Address
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET /users/me - Get current user profile
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-Password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role,
                Phone: user.Phone,
                Address: user.Address,
                Status: user.Status,
                Preferences: user.Preferences
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// PUT /users/Update/:id
router.put("/Update/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Email, Password, Role, Phone, Address, Status } = req.body;

        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is being changed and if new email already exists
        if (Email && Email !== existingUser.Email) {
            const emailExists = await User.findOne({ Email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updateData = { 
            Name: Name || existingUser.Name,
            Email: Email || existingUser.Email,
            Role: Role || existingUser.Role,
            Phone: Phone || existingUser.Phone,
            Address: Address || existingUser.Address,
            Status: Status !== undefined ? Status : existingUser.Status
        };

        // Hash password if provided
        if (Password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(Password, saltRounds);
            updateData.Password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { 
            new: true 
        }).select("-Password");

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /users/Delete/:id
router.delete("/Delete/:id", verifyToken, async (req, res) => {
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

// GET /users - Get all users (admin only)
router.get("/", verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await User.find().select("-Password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    setTokenExpiry(null);
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    delete axios.defaults.headers.common['Authorization'];
    
    // REMOVED: axios.post('/users/logout').catch(() => {});
    
    navigate('/login');
};
// POST /users/change-password
router.post("/change-password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.Password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /users/reset-password
router.post("/reset-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ Email: email });
        if (!user) {
            // Don't reveal that user doesn't exist for security
            return res.json({ message: "If an account exists with this email, a reset link will be sent" });
        }

        // In production, you would:
        // 1. Generate reset token
        // 2. Send email with reset link
        // 3. Store reset token in database with expiry
        
        // For now, we'll just return a success message
        res.json({ 
            message: "Password reset instructions sent to email",
            note: "In production, implement email sending logic here"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;