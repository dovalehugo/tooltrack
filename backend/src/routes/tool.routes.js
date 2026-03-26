const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/tool.controller');

router.use(auth);

router.post('/import', controller.importTools);

router.post('/', controller.createTool);
router.get('/', controller.getTools);
router.put('/:id', controller.updateTool);
router.delete('/:id', controller.deleteTool);

module.exports = router;