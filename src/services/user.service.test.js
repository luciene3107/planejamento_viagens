const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const { createUser } = require("./user.service");

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("../models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("user.service createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates user and returns identifier for valid data", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({ _id: "507f1f77bcf86cd799439011" });

    const result = await createUser({
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
    expect(result).toEqual({ id: "507f1f77bcf86cd799439011" });
  });

  it("throws conflict when email already exists", async () => {
    User.findOne.mockResolvedValue({ _id: "existing-user" });

    await expect(
      createUser({
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

  it("throws bad request when password does not meet policy", async () => {
    await expect(
      createUser({
        name: "Ana",
        email: "ana@exemplo.com",
        password: "12345",
      })
    ).rejects.toMatchObject({
      status: 400,
      message: "password must be at least 8 characters and contain at least 1 number.",
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });

  it("throws bad request when required fields are missing", async () => {
    await expect(
      createUser({
        name: "",
        email: "ana@exemplo.com",
        password: "senha1234",
      })
    ).rejects.toMatchObject({
      status: 400,
      message: "name and email are required.",
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });
});
