const heuristicasService = require("../services/heuristicas.service");
const heuristicasController = require("./heuristicas.controller");

jest.mock("../services/heuristicas.service", () => ({
  createHeuristica: jest.fn(),
}));

const buildResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("heuristicas.controller create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 with the created heuristic", async () => {
    const req = {
      body: {
        nome: "Menor custo",
        descricao: "Prioriza opcoes com menor custo total.",
      },
      user: {
        id: "507f1f77bcf86cd799439011",
      },
    };
    const res = buildResponse();
    const next = jest.fn();

    heuristicasService.createHeuristica.mockResolvedValue({
      id: "6814f42db637f17f43549a76",
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      status: "ativa",
      usuario: "507f1f77bcf86cd799439011",
    });

    await heuristicasController.create(req, res, next);

    expect(heuristicasService.createHeuristica).toHaveBeenCalledWith({
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      usuarioId: "507f1f77bcf86cd799439011",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      heuristica: {
        id: "6814f42db637f17f43549a76",
        nome: "Menor custo",
        descricao: "Prioriza opcoes com menor custo total.",
        status: "ativa",
        usuario: "507f1f77bcf86cd799439011",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards service errors to the error middleware", async () => {
    const req = {
      body: {
        nome: "Menor custo",
        descricao: "Prioriza opcoes com menor custo total.",
      },
      user: {
        id: "507f1f77bcf86cd799439011",
      },
    };
    const res = buildResponse();
    const next = jest.fn();
    const error = new Error("Heuristica name already in use for this user.");
    error.status = 409;

    heuristicasService.createHeuristica.mockRejectedValue(error);

    await heuristicasController.create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
