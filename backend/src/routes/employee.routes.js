const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const demoLimit = require('../middlewares/demoLimit.middleware');
const controller = require('../controllers/employee.controller');

// Middleware de protección
router.use(auth);

// IMPORT - solo admin
router.post('/import', role('admin'), controller.importEmployees);

// CRUD
router.post(
  '/',
  role('admin', 'user', 'demo'),
  demoLimit('employeeCreates', 20),
  controller.createEmployee
);

router.get('/', role('admin', 'user', 'demo'), controller.getEmployees);

router.put('/:id', role('admin', 'user', 'demo'), controller.updateEmployee);

router.delete(
  '/:id',
  role('admin', 'user', 'demo'),
  demoLimit('employeeDeletes', 20),
  controller.deleteEmployee
);

module.exports = router;