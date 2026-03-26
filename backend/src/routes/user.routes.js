const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/user.controller');

router.use(auth);
router.use(role('admin'));

router.get('/', controller.getUsers);
router.post('/', controller.createUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;