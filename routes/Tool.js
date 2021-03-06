const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middelewares/Validate-fields");

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const {
  registrerTool,
  registerActives,
  getActives,
  getTools,
  changeStatus,
  getToolsByStatus,
  deleteActivesTool,
} = require("../controllers/Tool.js");

router.post(
  "/registrar",
  [
    check("name", "Nombre de la herramienta requerido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  registrerTool
);

router.post(
  "/registrar-activos",
  [
     check("tools","Se requieren datos").not().isEmpty(),
     validate_fields,
  ],
  md_auth.authenticated,
  registerActives
);

router.put(
  "/cambiar-estado/:id",
  [check("status", "estado no recibido").not().isEmpty(), validate_fields],
  md_auth.authenticated,
  changeStatus
);
router.get("/activas/:page?", md_auth.authenticated, getActives);
router.get("/registradas/:page?", md_auth.authenticated, getTools);
router.get(
  "/ver/:status/:page?",
  md_auth.authenticated,
  getToolsByStatus
);

router.delete("/eliminar-activos/:id",
[
  check("tools", "Se necesitan datos para eliminar en masa").not().isEmpty(),
  validate_fields,
],
 md_auth.authenticated,
 deleteActivesTool);

module.exports = router;
