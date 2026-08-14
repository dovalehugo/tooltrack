const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    tools: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool',
        required: true,
      },
    ],
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

loanSchema.index({ employee: 1, estado: 1, fechaPrestamo: 1 });
loanSchema.index({ tools: 1, estado: 1 });
loanSchema.index({ estado: 1, createdAt: -1 });

module.exports = mongoose.model('Loan', loanSchema);