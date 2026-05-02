const express = require("express");

const authRoutes = require("./auth.routes");
const usersRoutes = require("./users.routes");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "API running.",
  });
});

router.get("/protected/health", authMiddleware, (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "Protected route is accessible.",
    userId: req.user.id,
  });
});

router.use("/usuarios", usersRoutes);
router.use("/auth", authRoutes);

module.exports = router;
