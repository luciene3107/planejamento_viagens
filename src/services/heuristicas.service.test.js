const mongoose = require("mongoose");

const Heuristica = require("../models/heuristica.model");
const heuristicasService = require("./heuristicas.service");

jest.mock("../models/heuristica.model", () => ({
  findOne: jest.fn(),
}));

describe("heuristicas.service getHeuristicaById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns essential fields when heuristic exists for the user", async () => {
    const createdAt = new Date("2026-05-02T10:00:00.000Z");

    Heuristica.findOne.mockResolvedValue({
      _id: "6814f42db637f17f43549a76",
      nome: "Menor custo",
      descricao: "Prioriza opcoes com menor custo total.",
      status: "inativa",
      createdAt,
      usuario: "507f1f77bcf86cd799439011",
    });

    const result = await heuristicasService.getHeuristicaById({
      id: "6814f42db637f17f43549a76",
      usuarioId: "507f1f77bcf86cd799439011",
    });

    expect(Heuristica.findOne).toHaveBeenCalledWith({
      _id: "6814f42db637f17f43549a76",
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
  });
});
