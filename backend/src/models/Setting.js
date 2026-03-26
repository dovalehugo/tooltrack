const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      default: 'ToolTrack',
    },
    maxLoanDays: {
      type: Number,
      default: 7,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);