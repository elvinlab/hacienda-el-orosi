const { Router } = require('express');
const { check } = require('express-validator');
const { validate_fields } = require('../middlewares/Validate-fields');

const md_auth = require('../middlewares/Authenticated');
const router = Router();

const {
  registerTool,
  registerActives,
  changeStatus,
  getToolsByStatus,
  getActives,
  getActivesByCollaborator,
  deleteActivesTool
} = require('../controllers/Tool.js');

router.post(
  '/registrar',
  [check('name', 'Nombre de la herramienta requerido').not().isEmpty(), validate_fields],
  md_auth.authenticated,
  registerTool
);

router.post(
  '/registrar-activos',
  [check('tools', 'Se requieren datos').not().isEmpty(), validate_fields],
  md_auth.authenticated,
  registerActives
);

router.put(
  '/cambiar-estado/:id',
  [check('status', 'estado no recibido').not().isEmpty(), validate_fields],
  md_auth.authenticated,
  changeStatus
);
router.get('/ver/:status', md_auth.authenticated, getToolsByStatus);
router.get('/activas', md_auth.authenticated, getActives);
router.get('/activas/colaborador/:id', md_auth.authenticated, getActivesByCollaborator);

router.delete(
  '/eliminar-activos',
  [check('tools', 'Se necesitan datos para eliminar en masa').not().isEmpty(), validate_fields],
  md_auth.authenticated,
  deleteActivesTool
);

module.exports = router;
