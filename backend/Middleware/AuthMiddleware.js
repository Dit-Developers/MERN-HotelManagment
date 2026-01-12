const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

// Protect routes - verify token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Not authorized to access this route" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User no longer exists" 
            });
        }

        // Check if user is active
        if (!user.Status) {
            return res.status(401).json({ 
                success: false,
                message: "Account is deactivated" 
            });
        }

        // Grant access to protected route
        req.user = {
            userId: user._id,
            role: user.Role,
            email: user.Email,
            hotelId: user.HotelId
        };
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token" 
            });
        }
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false,
                message: "Token expired" 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

// Authorize roles middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: "Not authorized" 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Role ${req.user.role} is not authorized to access this route` 
            });
        }

        next();
    };
};

// Check permission middleware
exports.checkPermission = (permission) => {
    const rolePermissions = {
        // Admin has all permissions
        admin: ['all'],
        // Manager permissions
        manager: ['view_dashboard', 'manage_rooms', 'manage_bookings', 'view_reports', 'manage_housekeeping'],
        // Receptionist permissions
        receptionist: ['view_dashboard', 'manage_bookings', 'make_bookings'],
        // Housekeeping permissions
        housekeeping: ['view_dashboard', 'manage_housekeeping'],
        // Guest permissions
        guest: ['make_bookings']
    };

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: "Not authorized" 
            });
        }

        const userRole = req.user.role;
        const hasPermission = rolePermissions[userRole]?.includes('all') || 
                              rolePermissions[userRole]?.includes(permission);

        if (!hasPermission) {
            return res.status(403).json({ 
                success: false,
                message: `You don't have permission to ${permission}` 
            });
        }

        next();
    };
};