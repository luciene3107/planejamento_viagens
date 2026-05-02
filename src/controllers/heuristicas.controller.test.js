const heuristicasService = require("../services/heuristicas.service");
const heuristicasController = require("./heuristicas.controller");

jest.mock("../services/heuristicas.service", () => ({
  getHeuristicaById: jest.fn(),
}));

const buildResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("heuristicas.controller show", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with the requested heuristic", async () => {
    const createdAt = new Date("2026-05-02T10:00:00.000Z");
    const req = {
      params: {
        id: "6814f42db637f17f43549a76",
      },
      user: {
        id: "507f1f77bcf86cd799439011",
      },
    };
    const res = buildResponse();
    const next = jest.fn();

    heuristicasService.getHeuristicaById.mockResolvedValue({
      id: "6814f42db637f17f43549a76",
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      status: "ativa",
      createdAt,
    });

    await heuristicasController.show(req, res, next);

    expect(heuristicasService.getHeuristicaById).toHaveBeenCalledWith({
      id: "6814f42db637f17f43549a76",
      usuarioId: "507f1f77bcf86cd799439011",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      heuristica: {
        id: "6814f42db637f17f43549a76",
        nome: "Menor custo",
        descricao: "Prioriza opcoes com menor custo total.",
        status: "ativa",
        createdAt,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards not found errors to the error middleware", async () => {
    const req = {
      params: {
        id: "6814f42db637f17f43549a76",
      },
      user: {
        id: "507f1f77bcf86cd799439011",
      },
    };
    const res = buildResponse();
    const next = jest.fn();
    const error = new Error("Heuristica not found.");
    error.status = 404;

    heuristicasService.getHeuristicaById.mockRejectedValue(error);

    await heuristicasController.show(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
