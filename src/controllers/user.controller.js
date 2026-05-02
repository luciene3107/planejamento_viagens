const userService = require("../services/user.service");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const payload = await userService.createUser({ name, email, password });
    return res.status(201).json(payload);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
};
