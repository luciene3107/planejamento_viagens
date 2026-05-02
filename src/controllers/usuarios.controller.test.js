const usuariosService = require("../services/usuarios.service");
const usuariosController = require("./usuarios.controller");

jest.mock("../services/usuarios.service", () => ({
  createUser: jest.fn(),
}));

const buildResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("usuarios.controller create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 with the created user", async () => {
    const req = {
      body: {
        name: "Ana",
        email: "ana@exemplo.com",
        password: "senha1234",
      },
    };
    const res = buildResponse();
    const next = jest.fn();

    usuariosService.createUser.mockResolvedValue({
      id: "507f1f77bcf86cd799439011",
      name: "Ana",
      email: "ana@exemplo.com",
    });

    await usuariosController.create(req, res, next);

    expect(usuariosService.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: "507f1f77bcf86cd799439011",
        name: "Ana",
        email: "ana@exemplo.com",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", async () => {
    const req = {
      body: {
        email: "ana@exemplo.com",
        password: "senha1234",
      },
    };
    const res = buildResponse();
    const next = jest.fn();

    await usuariosController.create(req, res, next);

    expect(usuariosService.createUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "name, email and password are required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards service errors to the error middleware", async () => {
    const req = {
      body: {
        name: "Ana",
        email: "ana@exemplo.com",
        password: "senha1234",
      },
    };
    const res = buildResponse();
    const next = jest.fn();
    const error = new Error("Email already in use.");
    error.status = 409;

    usuariosService.createUser.mockRejectedValue(error);

    await usuariosController.create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
