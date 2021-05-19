const { Router } = require('express');
const { check } = require('express-validator');
const { validate_fields } = require('../middlewares/Validate-fields');

const md_auth = require('../middlewares/Authenticated');
const router = Router();

const {
  save,
  getContractsByStatus,
  getContractsByContracted,
  changeStatus
} = require('../controllers/Contract.js');

router.post(
  '/realizar-contracto',
  [
    check('name_contracted', 'Nombre de la persona contratada Requerido ').not().isEmpty(),
    check('id_contracted', 'Cedula requerida').not().isEmpty(),
    check('email_contracted', 'Correo requerido').not().isEmpty(),
    check('address', 'Direccion requerida').not().isEmpty(),
    check('cel', 'Celular requerido').not().isEmpty(),
    check('phone', 'Telefono requerido').not().isEmpty(),
    check('starting_amount', 'Pago inicial requerido').not().isEmpty(),
    check('total_amount', 'pago total requerido').not().isEmpty(),
    check('starting_date', 'Fecha de inicio requerido').not().isEmpty(),
    check('deadline', 'Fecha final requerida').not().isEmpty(),
    check('description', 'Descripcion del trabajo requerido').not().isEmpty(),
    validate_fields
  ],
  md_auth.authenticated,
  save
);

router.put(
  '/contrato/cambiar-estado/:id',
  [check('status', 'Estado no recibido').not().isEmpty(), validate_fields],
  check('deliver_date', 'Fecha de entrega requerido').not().isEmpty(),
  check('final_amount', 'pago final requerido').not().isEmpty(),
  check('observations', 'pago final requerido').not().isEmpty(),
  md_auth.authenticated,
  changeStatus
);

router.get('/ver-contratos/:status', md_auth.authenticated, getContractsByStatus);
router.get(
  '/ver-contratos/especificos/:status/:id',
  md_auth.authenticated,
  getContractsByContracted
);

module.exports = router;
