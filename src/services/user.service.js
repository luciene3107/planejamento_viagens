const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const isPasswordStrong = (password) => /^(?=.*\d).{8,}$/.test(password);

const createUser = async ({ name, email, password }) => {
  if (!name || !email) {
    const error = new Error("name and email are required.");
    error.status = 400;
    throw error;
  }

  if (!isPasswordStrong(password)) {
    const error = new Error(
      "password must be at least 8 characters and contain at least 1 number."
    );
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already in use.");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
  };
};

module.exports = {
  createUser,
};
