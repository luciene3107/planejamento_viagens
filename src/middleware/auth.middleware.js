const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET not configured." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.sub };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
