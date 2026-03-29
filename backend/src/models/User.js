const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'demo'],
      default: 'user',
    },
    demoLimits: {
      employeeCreates: { type: Number, default: 0 },
      employeeDeletes: { type: Number, default: 0 },
      toolCreates: { type: Number, default: 0 },
      toolDeletes: { type: Number, default: 0 },
      loanCreates: { type: Number, default: 0 },
      loanReturns: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);