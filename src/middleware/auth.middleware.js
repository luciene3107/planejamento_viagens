const jwt = require("jsonwebtoken");
const getEnv = require("../config/env");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const env = getEnv();
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.sub };
    return next();
  } catch (error) {
    if (error.message === "JWT_SECRET is not defined in environment variables.") {
      return res.status(500).json({ message: "JWT_SECRET not configured." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
