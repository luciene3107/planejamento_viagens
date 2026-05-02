const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const PASSWORD_RULE_MESSAGE =
  "Password must have at least 8 characters and include at least 1 number.";

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 8 || !/\d/.test(password)) {
    const error = new Error(PASSWORD_RULE_MESSAGE);
    error.status = 400;
    throw error;
  }
};

const createUser = async ({ name, email, password }) => {
  validatePassword(password);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already in use.");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

module.exports = {
  PASSWORD_RULE_MESSAGE,
  createUser,
};
