const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/Validate-fields");

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const {
  register,
  getMedicalRecords,
  getHealthByAnimal,
} = require("../controllers/Health.js");

router.post(
  "/registro-medico/:id",
  [
    check("medicamentID", "Medicamento requerido").not().isEmpty(),
    check("dose", "Dosis suministrada requerida").not().isEmpty(),

    validate_fields,
  ],
  md_auth.authenticated,
  register
);

router.get(
  "/listar-registros-medico/:page",
  md_auth.authenticated,
  getMedicalRecords
);
router.get(
  "/listar-salud-animal/:id",
  md_auth.authenticated,
  getHealthByAnimal
);

module.exports = router;
