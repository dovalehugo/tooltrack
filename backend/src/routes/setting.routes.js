const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/setting.controller');

router.use(auth);

router.get('/', controller.getSettings);
router.put('/', controller.updateSettings);

module.exports = router;