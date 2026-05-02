/* const heuristicasService = require("../services/heuristicas.service");

const show = async (req, res, next) => {
  try {
    const heuristica = await heuristicasService.getHeuristicaById({
      id: req.params.id,
      usuarioId: req.user.id,
    });

    return res.status(200).json({ heuristica });
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
      show,
      create,
    };
 */

const heuristicasService = require("../services/heuristicas.service");

const show = async (req, res, next) => {
  try {
    const heuristica = await heuristicasService.getHeuristicaById({
      id: req.params.id,
      usuarioId: req.user.id,
    });

    return res.status(200).json({ heuristica });
  } catch (error) {
    return next(error);
  }
};

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
  show,
  create,
};