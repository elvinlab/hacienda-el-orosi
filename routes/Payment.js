const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middelewares/Validate-fields");

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const {
  registerSalaryCollaboratior,
  paymentsByCollaborator,
  getPayments,
} = require("../controllers/Payment.js");

router.post(
  "/realizar/pago/colaborador/:id",
  [
    check("net_salary", "Salario bruto  del colaborador requerido").not().isEmpty(),
    check("final_salary", "Salario total del colaborador requerido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  registerSalaryCollaboratior
);
router.get(
  "/pagos/colaborador/:id/:page?",
  md_auth.authenticated,
  paymentsByCollaborator
);
router.get(
    "/pagos/realizados/:page?",
    md_auth.authenticated,
    getPayments
  );

module.exports = router;
