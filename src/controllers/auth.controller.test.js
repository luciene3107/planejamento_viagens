const authService = require("../services/auth.service");
const authController = require("./auth.controller");

jest.mock("../services/auth.service", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const buildResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("auth.controller login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with token and expiration", async () => {
    const req = {
      body: {
        email: "ana@exemplo.com",
        password: "senha1234",
      },
    };
    const res = buildResponse();
    const next = jest.fn();
    const payload = {
      token: "token-value",
      expiresIn: "1d",
      user: {
        id: "507f1f77bcf86cd799439011",
        name: "Ana",
        email: "ana@exemplo.com",
      },
    };

    authService.login.mockResolvedValue(payload);

    await authController.login(req, res, next);

    expect(authService.login).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when credentials fields are missing", async () => {
    const req = {
      body: {
        email: "ana@exemplo.com",
      },
    };
    const res = buildResponse();
    const next = jest.fn();

    await authController.login(req, res, next);

    expect(authService.login).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "email and password are required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards authentication errors to the error middleware", async () => {
    const req = {
      body: {
        email: "ana@exemplo.com",
        password: "wrong-pass",
      },
    };
    const res = buildResponse();
    const next = jest.fn();
    const error = new Error("Invalid credentials.");
    error.status = 401;

    authService.login.mockRejectedValue(error);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
