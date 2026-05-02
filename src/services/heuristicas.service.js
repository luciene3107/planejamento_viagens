const Heuristica = require("../models/heuristica.model");

const REQUIRED_FIELDS_MESSAGE = "nome and descricao are required.";
const DUPLICATE_NAME_MESSAGE = "Heuristica name already in use for this user.";

const validateRequiredFields = ({ nome, descricao }) => {
  if (!nome || !descricao) {
    const error = new Error(REQUIRED_FIELDS_MESSAGE);
    error.status = 400;
    throw error;
  }
};

const createHeuristica = async ({ nome, descricao, usuarioId }) => {
  validateRequiredFields({ nome, descricao });

  const existingHeuristica = await Heuristica.findOne({ usuario: usuarioId, nome });

  if (existingHeuristica) {
    const error = new Error(DUPLICATE_NAME_MESSAGE);
    error.status = 409;
    throw error;
  }

  const heuristica = await Heuristica.create({
    nome,
    descricao,
    status: "ativa",
    usuario: usuarioId,
  });

  return {
    id: heuristica._id,
    nome: heuristica.nome,
    descricao: heuristica.descricao,
    status: heuristica.status,
    usuario: heuristica.usuario,
  };
};

module.exports = {
  DUPLICATE_NAME_MESSAGE,
  REQUIRED_FIELDS_MESSAGE,
  createHeuristica,
};
