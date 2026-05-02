const usuariosService = require("../services/usuarios.service");

const create = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required.",
      });
    }

    const user = await usuariosService.createUser({ name, email, password });
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
};
