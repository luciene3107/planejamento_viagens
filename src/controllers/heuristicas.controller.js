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

module.exports = {
  show,
};
