const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/Validate-fields");

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const {
  register,
  update,
  changeStatus,
  changeNextDueDate,
  getAnimalByType,
  getAnimalByStatusAndType,
  getAnimals,
  findAnimalByPlateNumber
} = require("../controllers/Animal.js");

router.post(
  "/registrar-animal",
  md_auth.authenticated,
  [
    check("plate_number", "Numero de chapa requerida requerida")
      .not()
      .isEmpty(),

    check("date_admission", "La fecha de registro es requerida")
      .not()
      .isEmpty(),

    check("type_animal", "Tipo de animal  requerido").not().isEmpty(),
    check("status", "El estado es requerido").not().isEmpty(),

    validate_fields,
  ],
  register
);

router.put(
  "/actualizar-animal/:id",
  md_auth.authenticated,
  [
    check("plate_number", "Numero de chapa requerida requerida")
      .not()
      .isEmpty(),

    check("date_admission", "La fecha de registro es requerida")
      .not()
      .isEmpty(),

    check("type_animal", "Tipo de animal  requerido").not().isEmpty(),
    check("status", "El estado es requerido").not().isEmpty(),
    validate_fields,
  ],
  update
);

router.put(
  "/actualizar-estado/:id",
  md_auth.authenticated,
  [check("status", "Estado no recibido").not().isEmpty(), validate_fields],
  changeStatus
);

router.put(
  "/actualizar/fecha-proxima-de-parto/:id",
  md_auth.authenticated,
  [
    check("next_due_date", "Fecha no recibida").not().isEmpty(),
    validate_fields,
  ],
  changeNextDueDate
);

router.get("/animales/:page?", md_auth.authenticated, getAnimals);

router.get("/animales/tipo/:type/:page?", md_auth.authenticated, getAnimalByType);
router.get("/animales/tipo/:type/estado/:status/:page?", md_auth.authenticated, getAnimalByStatusAndType);

router.get("/buscar/:id", md_auth.authenticated, findAnimalByPlateNumber);

module.exports = router;
