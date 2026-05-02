const express = require("express");

const heuristicasController = require("../controllers/heuristicas.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, heuristicasController.create);

module.exports = router;
