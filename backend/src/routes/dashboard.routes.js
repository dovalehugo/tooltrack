const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/dashboard.controller');

router.use(auth);

router.get('/', controller.getDashboardStats);

module.exports = router;