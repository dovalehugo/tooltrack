const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/employee.controller');

// Middleware de protección
router.use(auth);

// IMPORT
router.post('/import', controller.importEmployees);

// CRUD
router.post('/', controller.createEmployee);
router.get('/', controller.getEmployees);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;