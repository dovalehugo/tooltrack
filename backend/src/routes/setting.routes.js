const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/setting.controller');

router.use(auth);
router.use(role('admin'));

router.get('/', controller.getSettings);
router.put('/', controller.updateSettings);

module.exports = router;