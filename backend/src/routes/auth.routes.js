const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const { register, login } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', auth, role('admin'), register);

module.exports = router;