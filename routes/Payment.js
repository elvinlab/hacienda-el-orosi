const { Router } = require('express');
const { check } = require('express-validator');
const { validate_fields } = require('../middlewares/Validate-fields');

const md_auth = require('../middlewares/Authenticated');
const router = Router();

const {
  registerSalaryCollaborator,
  paymentsByCollaborator,
  getPayments,
  registerPresence,
  getDayPendingByCollaborator
} = require('../controllers/Payment.js');

router.post(
  '/realizar/pago/colaborador/:id',
  [check('paymentReg', 'Faltan datos').not().isEmpty(), validate_fields],
  md_auth.authenticated,
  registerSalaryCollaborator
);
router.post('/registrar/dia-laboral/:id', md_auth.authenticated, registerPresence);

router.get('/pagos/colaborador/:id', md_auth.authenticated, paymentsByCollaborator);
router.get('/pagos/realizados', md_auth.authenticated, getPayments);
router.get('/colaborador/dias-pendientes/:id', md_auth.authenticated, getDayPendingByCollaborator);

module.exports = router;
