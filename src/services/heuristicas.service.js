const mongoose = require("mongoose");

const Heuristica = require("../models/heuristica.model");

const NOT_FOUND_MESSAGE = "Heuristica not found.";

const mapHeuristica = (heuristica) => ({
  id: heuristica._id,
  nome: heuristica.nome,
  descricao: heuristica.descricao,
  status: heuristica.status,
  createdAt: heuristica.createdAt,
});

const getHeuristicaById = async ({ id, usuarioId }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(NOT_FOUND_MESSAGE);
    error.status = 404;
    throw error;
  }

  const heuristica = await Heuristica.findOne({
    _id: id,
    usuario: usuarioId,
  });

  if (!heuristica) {
    const error = new Error(NOT_FOUND_MESSAGE);
    error.status = 404;
    throw error;
  }

  return mapHeuristica(heuristica);
};

module.exports = {
  NOT_FOUND_MESSAGE,
  getHeuristicaById,
};
