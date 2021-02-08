const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middelewares/Validate-fields");

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const {
  save,
  removeJob,
  getJobs,
  updateJob,
} = require("../controllers/Job.js");

router.post(
  "/registrar-trabajo",
  [
    check("name_job", "Nombre del trabajo Requerido ").not().isEmpty(),
    check("description", "Descripción requerida").not().isEmpty(),
    check("work_hours", "Horas de trabajo requerido").not().isEmpty(),
    check("extra_hours", "Horas extra requerido").not().isEmpty(),
    check("price_day", "Precio del día requerida").not().isEmpty(),

    validate_fields,
  ],
  md_auth.authenticated,
  save
);

router.put(
  "/actualizar-trabajo/:id",
  [
    check("description", "Descripción requerida").not().isEmpty(),
    check("work_hours", "Horas de trabajo requerido").not().isEmpty(),
    check("extra_hours", "Horas extra requerido").not().isEmpty(),
    check("price_day", "Precio del día requerida").not().isEmpty(),
  ],
  md_auth.authenticated,
  updateJob
);

router.get("/ver-trabajos", md_auth.authenticated, getJobs);
router.delete("/remover-trabajo/:id", md_auth.authenticated, removeJob);

module.exports = router;
