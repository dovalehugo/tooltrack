const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const demoLimit = require('../middlewares/demoLimit.middleware');
const controller = require('../controllers/tool.controller');

router.use(auth);

router.post('/import', role('admin'), controller.importTools);

router.post(
  '/',
  role('admin', 'user', 'demo'),
  demoLimit('toolCreates', 20),
  controller.createTool
);

router.get('/', role('admin', 'user', 'demo'), controller.getTools);

router.put('/:id', role('admin', 'user', 'demo'), controller.updateTool);

router.delete(
  '/:id',
  role('admin', 'user', 'demo'),
  demoLimit('toolDeletes', 20),
  controller.deleteTool
);

module.exports = router;