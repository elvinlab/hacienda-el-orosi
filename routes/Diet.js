const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/Validate-fields");

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const {
  save,
  addAliment,
  removeDiet,
  deleteAliment,
  getDiets,
  getDietByAnimal,
  getAliments,
  updateDiet,
  updateAliment,
} = require("../controllers/Diet.js");

router.post(
  "/guardar-dieta",
  [
    check("stage", "Etapa requerida de la dieta ").not().isEmpty(),
    check("diet_name", "Nombre de la dieta requerida ").not().isEmpty(),
    check("animal", "Animal requerido ").not().isEmpty(),
    check("aliment", "Alimento  de la dieta requerido ").not().isEmpty(),

    validate_fields,
  ],
  md_auth.authenticated,
  save
);

router.post(
    "/agregar-alimento",
  [
    check("name_aliment", "Nombre del alimento requerido ").not().isEmpty(),
    check("quantity_supplied", "Cantidad suministrada requerida ")
      .not()
      .isEmpty(),
    check("price_aliment", "Precio del alimento requerido ").not().isEmpty(),

    validate_fields,
  ],
  md_auth.authenticated,
  addAliment
);

router.put(
  "/modificar-dieta/:id",
  [check("dietAliments", "Datos requeridos de la dieta ").not().isEmpty()],
  md_auth.authenticated,
  updateDiet
);

router.get("/listar-dietas", md_auth.authenticated, getDiets);
router.get("/dieta/animal/:id", md_auth.authenticated, getDietByAnimal);
router.get("/listar-alimentos", md_auth.authenticated, getAliments);
router.delete("/remover-dieta/:id", md_auth.authenticated, removeDiet);

module.exports = router;
