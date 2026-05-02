const mongoose = require("mongoose");

const heuristicaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ativa", "inativa"],
      default: "ativa",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

heuristicaSchema.index({ usuario: 1, nome: 1 }, { unique: true });

module.exports = mongoose.model("Heuristica", heuristicaSchema);
