const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    departamento: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

employeeSchema.index({ nombre: 1, apellido: 1 });
employeeSchema.index({ departamento: 1 });

module.exports = mongoose.model('Employee', employeeSchema);