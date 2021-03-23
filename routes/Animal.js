const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/Validate-fields");

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const { register } = require("../controllers/Animal.js");

router.post(
  "/registrar-animal",
  md_auth.authenticated,
  [
    check("plate_number", "Numero de chapa requerida requerida")
      .not()
      .isEmpty(),
    check("type_animal", "Tipo de animal  requerido").not().isEmpty(),
    check("status", "El estado es requerido").not().isEmpty(),
    check("date_admission", "La fecha de registro es requerida")
      .not()
      .isEmpty(),
    validate_fields,
  ],
  register
);

module.exports = router;
