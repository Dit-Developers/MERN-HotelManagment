const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel"); // Import User model

const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isEnabled) {
      return res.status(403).json({ message: "disabled" }); // Send a clear "disabled" message
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateJWT;
