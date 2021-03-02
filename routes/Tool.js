const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middelewares/Validate-fields");

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const {
  registrerTool,
  registerActive,
  getActives,
  getTools,
  changeStatus,
  getToolsByStatus,
  deleteActiveTool,
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
  "/registrar-activo",
  [
     check("collaborator_id","El colaborador es requerido").not().isEmpty(),
     check("tool_id","La herramienta es requerida").not().isEmpty(),
     validate_fields,
  ],
  md_auth.authenticated,
  registerActive
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
  "/ver/:status",
  md_auth.authenticated,
  getToolsByStatus
);

router.delete("/eliminar-activo/:id", md_auth.authenticated,deleteActiveTool);

module.exports = router;
