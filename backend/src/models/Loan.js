const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool',
      required: true,
    },
    fechaPrestamo: {
      type: Date,
      default: Date.now,
    },
    fechaDevolucionReal: {
      type: Date,
      default: null,
    },
    estado: {
      type: String,
      enum: ['activo', 'devuelto'],
      default: 'activo',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', loanSchema);