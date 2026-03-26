const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/loan.controller');

router.use(auth);

router.post('/', controller.createLoan);
router.get('/', controller.getLoans);
router.delete('/:id', controller.returnLoan);

module.exports = router;