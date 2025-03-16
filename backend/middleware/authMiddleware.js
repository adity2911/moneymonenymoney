const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.cookies) {
      return res.status(401).json({ error: "No cookies found" });
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized, no token provided" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
