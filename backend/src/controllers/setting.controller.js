const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        appName: 'ToolTrack',
        maxLoanDays: 7,
        notificationsEnabled: true,
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { appName, maxLoanDays, notificationsEnabled } = req.body;
    const updates = {};

    if (typeof appName === 'string' && appName.trim()) {
      updates.appName = appName.trim();
    }

    if (maxLoanDays !== undefined) {
      const parsedDays = Number(maxLoanDays);

      if (!Number.isFinite(parsedDays) || parsedDays < 1) {
        return res.status(400).json({
          message: 'maxLoanDays debe ser un número mayor que 0',
        });
      }

      updates.maxLoanDays = parsedDays;
    }

    if (typeof notificationsEnabled === 'boolean') {
      updates.notificationsEnabled = notificationsEnabled;
    }

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        appName: updates.appName || 'ToolTrack',
        maxLoanDays: updates.maxLoanDays || 7,
        notificationsEnabled:
          updates.notificationsEnabled !== undefined
            ? updates.notificationsEnabled
            : true,
      });
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, updates, {
        new: true,
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};