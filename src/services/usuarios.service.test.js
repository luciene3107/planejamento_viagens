const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const usuariosService = require("./usuarios.service");

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("usuarios.service createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user with a hashed password when data is valid", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      name: "Ana",
      email: "ana@exemplo.com",
      password: "hashed-password",
    });

    const result = await usuariosService.createUser({
      name: "Ana",
      email: "ana@exemplo.com",
      password: "senha1234",
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "ana@exemplo.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("senha1234", 10);
    expect(User.create).toHaveBeenCalledWith({
      name: "Ana",
      email: "ana@exemplo.com",
      password: "hashed-password",
    });
    expect(result).toEqual({
      id: "507f1f77bcf86cd799439011",
      name: "Ana",
      email: "ana@exemplo.com",
    });
  });

  it("returns conflict when email is already in use", async () => {
    User.findOne.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      email: "ana@exemplo.com",
    });

    await expect(
      usuariosService.createUser({
        name: "Ana",
        email: "ana@exemplo.com",
        password: "senha1234",
      })
    ).rejects.toMatchObject({
      status: 409,
      message: "Email already in use.",
    });

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("returns bad request when password does not match the minimum rule", async () => {
    await expect(
      usuariosService.createUser({
        name: "Ana",
        email: "ana@exemplo.com",
        password: "12345",
      })
    ).rejects.toMatchObject({
      status: 400,
      message: usuariosService.PASSWORD_RULE_MESSAGE,
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });
});
