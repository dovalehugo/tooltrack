const User = require('../models/User');

module.exports = (action, max) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'No autorizado',
        });
      }

      if (req.user.role !== 'demo') {
        return next();
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado',
        });
      }

      const currentCount = user.demoLimits?.[action] || 0;

      if (currentCount >= max) {
        return res.status(403).json({
          message: `Has alcanzado el límite permitido para esta acción (${max}).`,
        });
      }

      req.demoUser = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
};