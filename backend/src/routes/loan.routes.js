const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const demoLimit = require('../middlewares/demoLimit.middleware');
const controller = require('../controllers/loan.controller');

router.use(auth);

router.post(
  '/',
  role('admin', 'user', 'demo'),
  demoLimit('loanCreates', 20),
  controller.createLoan
);

router.get('/', role('admin', 'user', 'demo'), controller.getLoans);

router.delete(
  '/:id',
  role('admin', 'user', 'demo'),
  demoLimit('loanReturns', 20),
  controller.returnLoan
);

module.exports = router;