const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check user status - only allow "active" users
    if (user.status !== "active") {
      return res.status(403).json({ 
        message: `Account is ${user.status}. Please contact administrator.`,
        status: user.status
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token expired. Please login again." });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token." });
    }
    
    return res.status(403).json({ message: "Authentication failed." });
  }
};

module.exports = authenticateJWT;