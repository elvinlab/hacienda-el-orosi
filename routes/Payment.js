const { Router } = require ( 'express');
const { check } = require ( 'express-validator');
const { validate_fields } = require ('../middelewares/Validate-fields'); 

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const{
    register,
    paymentsByCollaborator,
    paymentsByAdministrator,
    } = require ('../controllers/Payment.js');

router.post(
    '/realizar-pago/:id',
    [
        check('net_salary', "Salario bruto requerido" ).not().isEmpty(),
        check('final_salary', "Salario total requerido" ).not().isEmpty(),
        validate_fields,
    ],
    md_auth.authenticated,
    register,
    
);
router.get("/pagos/colaborador/:id", md_auth.authenticated, paymentsByCollaborator);
router.get("/pagos/administrador/:id", md_auth.authenticated, paymentsByAdministrator);


module.exports = router;