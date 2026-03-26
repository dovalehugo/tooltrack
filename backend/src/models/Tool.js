const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cantidadTotal: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    cantidadDisponible: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tool', toolSchema);