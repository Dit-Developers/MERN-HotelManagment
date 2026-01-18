const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden. You do not have necessary permissions" });
    }
    next();
  };
};

module.exports = authorizeRole;
