// authorizationMiddleware.js
const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Forbidden. You do not have necessary permissions" });
      }
      next();
    };
  };
  
  module.exports = authorizeRole;  // Make sure you export it correctly
  