const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middelewares/Validate-fields");

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const {
  register,
  update,
  changeStatus,
  getCollaborators,
  getCollaboratorsActives,
  assignWork,
  removeAssignWork,
  listActivities,
  listActivitiesByCollaborator,
  getCollaborator,
} = require("../controllers/Collaborator.js");

router.post(
  "/registrar-colaborador",
  [
    check("document_id", "Cédula requerida").not().isEmpty(),
    check("nationality", "Nacionalidad requerida").not().isEmpty(),
    check("name", "Nombre requerido").not().isEmpty(),
    check("surname", "apellido requerido").not().isEmpty(),
    check("direction", "Dirección requerida").not().isEmpty(),
    check("tel", "Telefono requerido").not().isEmpty(),
    check("cel", "Celular requerido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  register
);

router.put(
  "/actualizar-colaborador/:id",
  [
    check("nationality", "Nacionalidad requerida").not().isEmpty(),
    check("name", "Nombre requerido").not().isEmpty(),
    check("surname", "apellido requerido").not().isEmpty(),
    check("direction", "Dirección requerida").not().isEmpty(),
    check("tel", "Telefono requerido").not().isEmpty(),
    check("cel", "Celular requerido").not().isEmpty(),
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

router.get(
    "/todos-los-colaboradores/:page?",
    md_auth.authenticated,
    getCollaborators
  );

  
router.get(
    "/colaboradores-activos/:page?",
    md_auth.authenticated,
    getCollaboratorsActives
  );

  router.post(
    "/asignar-actividad",
    [
      check("documentId", "Cédula requerida").not().isEmpty(),
      check("jobId", "Cédula requerida").not().isEmpty(),
      validate_fields,
    ],
    assignWork
  );

  router.delete("/remover-actividad/:id", md_auth.authenticated, removeAssignWork);

module.exports = router;
