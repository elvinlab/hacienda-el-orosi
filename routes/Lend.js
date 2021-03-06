const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middelewares/Validate-fields");

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const {
  make,
  registerFee,
  getFeesByLend,
  getLendsByCollaborator,
  getLendsByStatus,
  deleteLend,
  changeAmountFee,
} = require("../controllers/Lend.js");

router.post(
  "/realizar-prestamo",
  [
    check("collaborator_id", "El colaborador es requerido").not().isEmpty(),
    check("initial_amount", "El monto inicial es requerido").not().isEmpty(),
    check("fee_amount", "La cuota es requerida").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  make
);

router.post(
  "/registrar-cuota",
  [
    check("collaborator_id", "El colaborador es requerido").not().isEmpty(),
    check("lend_id", "El prestamo es requerido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  registerFee
);

router.get("/historial-cuotas/:id", [
  md_auth.authenticated,
  getFeesByLend,
]);

router.put(
  "/cambiar-cuota/:id",
  [check("newFee", "Nueva cuota requerida").not().isEmpty(), validate_fields],
  md_auth.authenticated,
  changeAmountFee
);

router.delete("/eliminar-prestamo/:id", md_auth.authenticated, deleteLend);

router.get(
  "/prestamos/:status/:page?",
  md_auth.authenticated,
  getLendsByStatus
);
router.get(
  "/colaborador/prestamos/:id/:page?",
  md_auth.authenticated,
  getLendsByCollaborator
);
module.exports = router;
