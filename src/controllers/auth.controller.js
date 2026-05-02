const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required.",
      });
    }

    const payload = await authService.register({ name, email, password });
    return res.status(201).json(payload);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required.",
      });
    }

    const payload = await authService.login({ email, password });
    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
