// middleware/authMiddleware.js
module.exports = function requireRole(role) {
  return (req, res, next) => {
    // Example: role can be "admin", "agent", "user"
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
};
