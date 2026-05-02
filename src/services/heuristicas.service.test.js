const Heuristica = require("../models/heuristica.model");
const heuristicasService = require("./heuristicas.service");

jest.mock("../models/heuristica.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe("heuristicas.service createHeuristica", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an active heuristic when data is valid and name is unique for the user", async () => {
    Heuristica.findOne.mockResolvedValue(null);
    Heuristica.create.mockResolvedValue({
      _id: "6814f42db637f17f43549a76",
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      status: "ativa",
      usuario: "507f1f77bcf86cd799439011",
    });

    const result = await heuristicasService.createHeuristica({
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      usuarioId: "507f1f77bcf86cd799439011",
    });

    expect(Heuristica.findOne).toHaveBeenCalledWith({
      usuario: "507f1f77bcf86cd799439011",
      nome: "Menor custo",
    });
    expect(Heuristica.create).toHaveBeenCalledWith({
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      status: "ativa",
      usuario: "507f1f77bcf86cd799439011",
    });
    expect(result).toEqual({
      id: "6814f42db637f17f43549a76",
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      status: "inativa",
      createdAt,
    });
  });

  it("returns not found when heuristic does not exist or is not accessible", async () => {
    Heuristica.findOne.mockResolvedValue(null);

    await expect(
      heuristicasService.getHeuristicaById({
        id: "6814f42db637f17f43549a76",
        usuarioId: "507f1f77bcf86cd799439011",
      })
    ).rejects.toMatchObject({
      status: 404,
      message: heuristicasService.NOT_FOUND_MESSAGE,
    });
  });

  it("returns not found for invalid ids", async () => {
    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValueOnce(false);

    await expect(
      heuristicasService.getHeuristicaById({
        id: "123",
        usuarioId: "507f1f77bcf86cd799439011",
      })
    ).rejects.toMatchObject({
      status: 404,
      message: heuristicasService.NOT_FOUND_MESSAGE,
    });

    expect(Heuristica.findOne).not.toHaveBeenCalled();
      status: "ativa",
      usuario: "507f1f77bcf86cd799439011",
    });
  });

  it("returns conflict when heuristic name is already in use by the same user", async () => {
    Heuristica.findOne.mockResolvedValue({
      _id: "6814f42db637f17f43549a76",
      nome: "Menor custo",
      usuario: "507f1f77bcf86cd799439011",
    });

    await expect(
      heuristicasService.createHeuristica({
        nome: "Menor custo",
        descricao: "Prioriza opcoes com menor custo total.",
        usuarioId: "507f1f77bcf86cd799439011",
      })
    ).rejects.toMatchObject({
      status: 409,
      message: heuristicasService.DUPLICATE_NAME_MESSAGE,
    });

    expect(Heuristica.create).not.toHaveBeenCalled();
  });

  it("returns bad request when required fields are missing", async () => {
    await expect(
      heuristicasService.createHeuristica({
        nome: "Menor custo",
        usuarioId: "507f1f77bcf86cd799439011",
      })
    ).rejects.toMatchObject({
      status: 400,
      message: heuristicasService.REQUIRED_FIELDS_MESSAGE,
    });

    expect(Heuristica.findOne).not.toHaveBeenCalled();
    expect(Heuristica.create).not.toHaveBeenCalled();
  });
});
