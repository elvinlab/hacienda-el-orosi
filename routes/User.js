const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require( '../middelewares/Validate-fields' );

var md_auth = require("../middelewares/Authenticated");

const router = Router();

const {
  register,
  updateRole,
  removeAdmin,
  login,
  getUser,
  set_recovery_key,
  verify_recovery_key,
  change_password,
} = require("../controllers/User");

router.post(
  "/registrar-administrador",
  [
    check("document_id", "Cedula no recibida").not().isEmpty(),
    check("password", "Contraseña no recibida").not().isEmpty(),
    check("email", "Email no recibido").not().isEmpty(),
    check("name", "Nombre no recibido").not().isEmpty(),
    check("surname", "Nombre no recibido").not().isEmpty(),
    check("role", "Cargo no recibido").not().isEmpty(),
    validate_fields,
  ],
  md_auth.authenticated,
  register
);

router.post(
  "/cambiar-rol/:id",
  [check("role", "Rol no recibido").not().isEmpty(), validate_fields],
  md_auth.authenticated,
  updateRole
);

router.post("/remover-administrador/:id", md_auth.authenticated, removeAdmin);

router.post(
  "/ingresar",
  [
    check("document_id", "Cedula no recibida").not().isEmpty(),
    check("password", "Contraseña  no recibida").not().isEmpty(),
    validate_fields,
  ],
  login
);

router.get("/informacion-administrador", md_auth.authenticated, getUser);

router.get("/recuperar/cuenta/:email", set_recovery_key);

router.get("/verificar/codigo/:email/:codigo", verify_recovery_key);
router.put("/editar/cuenta/:email", change_password);

module.exports = router;
