const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const getEnv = require("../config/env");
const authService = require("./auth.service");

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../config/env", () =>
  jest.fn(() => ({
    jwtSecret: "jwt-secret",
    jwtExpiresIn: "1d",
  }))
);

describe("auth.service login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns token and expiration when credentials are valid", async () => {
    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      name: "Ana",
      email: "ana@exemplo.com",
      password: "hashed-password",
      isActive: true,
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token-value");

    const result = await authService.login({
      email: "ana@exemplo.com",
      password: "senha1234",
    });

    expect(getEnv).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalledWith("senha1234", "hashed-password");
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: "507f1f77bcf86cd799439011" },
      "jwt-secret",
      { expiresIn: "1d" }
    );
    expect(result).toEqual({
      token: "token-value",
      expiresIn: "1d",
      user: {
        id: "507f1f77bcf86cd799439011",
        name: "Ana",
        email: "ana@exemplo.com",
      },
    });
  });

  it("returns unauthorized for wrong password", async () => {
    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      password: "hashed-password",
      isActive: true,
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({
        email: "ana@exemplo.com",
        password: "wrong-pass",
      })
    ).rejects.toMatchObject({
      status: 401,
      message: "Invalid credentials.",
    });
  });

  it("returns forbidden for inactive user", async () => {
    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      password: "hashed-password",
      isActive: false,
    });

    await expect(
      authService.login({
        email: "inativo@exemplo.com",
        password: "senha1234",
      })
    ).rejects.toMatchObject({
      status: 403,
      message: "User cannot authenticate.",
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });
});
