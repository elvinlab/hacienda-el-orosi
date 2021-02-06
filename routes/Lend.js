const { Router } = require ( 'express' );
const { check } = require ( 'express-validator' );
const { validate_fields } = require( '../middelewares/Validate-fields' );

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const { 
    make,
    registerFee,
    deleteLend,
} = require ( '../controllers/Lend.js');

router.post(
    '/realizar-prestamo',
    [
        check("collaborator_id","El colaborador es requerido").not().isEmpty(),
        check("amount", "El monto es requerido").not().isEmpty(),
        validate_fields,
    ],
    md_auth.authenticated,
    make
 );

 router.post(
     "/registrar-cuota",
     [
        check("collaborator_id","El colaborador es requerido").not().isEmpty(),
        check("lend","El prestamo es requerido").not().isEmpty(),
        check("fee_week", "La cuota semanal es requerida").not().isEmpty(),
        validate_fields,
     ],
     md_auth.authenticated,
     registerFee
 );

 router.delete(
     "/eliminar-prestamo/:id",
     md_auth.authenticated,
     deleteLend
 );

module.exports = router;