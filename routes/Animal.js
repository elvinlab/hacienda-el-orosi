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
  findAnimalByPlateNumber,
} = require("../controllers/Animal.js");

const {
  addRegisterMilk,
  updateRegisterMilk,
  deleteRegisterMilk,
} = require("../controllers/Milk.js");

const {
  addRegisterCalving,
  updateRegisterCalving,
  deleteRegisterCalving,
} = require("../controllers/Calving.js");

const {
  addRegisterWeight,
  updateRegisterWeight,
  deleteRegisterWeight,
} = require("../controllers/Weight.js");

router.post(
  "/registrar",
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
    check("gender", "El genero es requerido").not().isEmpty(),

    validate_fields,
  ],
  register
);

router.put(
  "/actualizar/:id",
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

router.get("/todos/:page?", md_auth.authenticated, getAnimals);

router.get(
  "/tipo/:type/:page?",
  md_auth.authenticated,
  getAnimalByType
);
router.get(
  "/tipo/:type/estado/:status/:page?",
  md_auth.authenticated,
  getAnimalByStatusAndType
);

router.get("/buscar/:id", md_auth.authenticated, findAnimalByPlateNumber);

//Rutas de MIlk
router.post(
  "/registar-leche/vaca/:id",
  md_auth.authenticated,
  [
    check("liters", "Litros no recibidos").not().isEmpty(),
    check("registration_date", "Fecha no recibida").not().isEmpty(),
    validate_fields,
  ],
  addRegisterMilk
);

router.put(
  "/leche/:milk/acutalizar-registro/animal/:cow",
  md_auth.authenticated,
  [
    check("liters", "Litros no recibidos").not().isEmpty(),
    check("registration_date", "Fecha no recibida").not().isEmpty(),
    validate_fields,
  ],
  updateRegisterMilk
);

router.delete(
  "/vaca/:cow/eliminar-registro/leche/:milk",
  md_auth.authenticated,
  deleteRegisterMilk
);

//rutas de Calving

router.post(
  "/registar-parto/animal/:id",
  md_auth.authenticated,
  [
    check("date", "Fecha no recibida").not().isEmpty(),
    check("complications", "Complicaciones no recibidas").not().isEmpty(),
    validate_fields,
  ],
  addRegisterCalving
);

router.put(
  "/parto/:calving/acutalizar-registro/animal/:animal",
  md_auth.authenticated,
  [
    check("calving_number", "Numero de parto no recibidos").not().isEmpty(),
    check("date", "Fecha no recibida").not().isEmpty(),
    check("complications", "Complicaciones no recibidas").not().isEmpty(),
    validate_fields,
  ],
  updateRegisterCalving
);

router.delete(
  "/:animal/eliminar-parto/:calving",
  md_auth.authenticated,
  deleteRegisterCalving
);

//rutas de Weight

router.post(
  "/:animal/registar-peso",
  md_auth.authenticated,
  [
    check("weight", "Peso no recibido").not().isEmpty(),
    check("date", "Fecha no recibida").not().isEmpty(),
    check("observations", "Observaciones no recibidas").not().isEmpty(),
    validate_fields,
  ],
  addRegisterWeight
);

router.put(
  "/peso/:weight/acutalizar-registro/animal/:animal",
  md_auth.authenticated,
  [
    check("weight", "Peso no recibido").not().isEmpty(),
    check("date", "Fecha no recibida").not().isEmpty(),
    check("observations", "Observaciones no recibidas").not().isEmpty(),
    validate_fields,
  ],
  updateRegisterWeight
);

router.delete(
  "/:animal/eliminar-peso/:weight",
  md_auth.authenticated,
  deleteRegisterWeight
);

module.exports = router;
