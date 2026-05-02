const authMiddleware = require("./auth.middleware");

const buildResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("auth.middleware", () => {
  it("returns 401 when authentication is missing", () => {
    const req = {
      headers: {},
    };
    const res = buildResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
