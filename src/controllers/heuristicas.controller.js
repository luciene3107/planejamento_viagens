const heuristicasService = require("../services/heuristicas.service");

const create = async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;

    const heuristica = await heuristicasService.createHeuristica({
      nome,
      descricao,
      usuarioId: req.user.id,
    });

    return res.status(201).json({ heuristica });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  create,
};
