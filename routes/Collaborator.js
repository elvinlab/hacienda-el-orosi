const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/Validate-fields");

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const {
  register,
  update,
  changeStatus,
  getCollaboratorsByStatus,
  generatePDFByCollaborator,
  getCollaborator,
} = require("../controllers/Collaborator.js");

router.post(
  "/registrar-colaborador",
  [
    check("document_id", "Cédula requerida").not().isEmpty(),
    check("job", "Trabajo requerido").not().isEmpty(),
    check("nationality", "Nacionalidad requerida").not().isEmpty(),
    check("name", "Nombre requerido").not().isEmpty(),
    check("surname", "apellido requerido").not().isEmpty(),
    check("direction", "Dirección requerida").not().isEmpty(),
    check("tel", "Telefono requerido").not().isEmpty(),
    check("cel", "Celular requerido").not().isEmpty(),
    check("date_admission", "Fecha de inico requerida").not().isEmpty(),
    check("dispatch_date", "Fecha final requerida").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  register
);

router.put(
  "/actualizar-colaborador/:id",
  [
    check("document_id", "Cédula requerida").not().isEmpty(),
    check("job", "Trabajo requerido").not().isEmpty(),
    check("nationality", "Nacionalidad requerida").not().isEmpty(),
    check("name", "Nombre requerido").not().isEmpty(),
    check("surname", "apellido requerido").not().isEmpty(),
    check("direction", "Dirección requerida").not().isEmpty(),
    check("tel", "Telefono requerido").not().isEmpty(),
    check("cel", "Celular requerido").not().isEmpty(),
    check("date_admission", "Fecha de inico requerida").not().isEmpty(),
    check("dispatch_date", "Fecha final requerida").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  update
);

router.put(
  "/colaborador/cambiar-estado/:id",
  [
    check("status", "El estado para este colaborador es necesario")
      .not()
      .isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  changeStatus
);

router.get("/ver-colaborador/:id", md_auth.authenticated, getCollaborator);

router.get(
  "/colaboradores/:status",
  md_auth.authenticated,
  getCollaboratorsByStatus
);

router.get(
  "/reporte/colaboradores/:status",
  md_auth.authenticated,
  generatePDFByCollaborator
);

module.exports = router;
