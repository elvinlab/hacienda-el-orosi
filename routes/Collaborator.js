const { Router } = require ( 'express' );
const { check } = require ( 'express-validator' );
const { validate_fields } = require( '../middelewares/Validate-fields' );

const router = Router();

const { 
    register,
    } = require( '../controllers/Collaborator.js');

router.post( 
    '/registrar-colaborador',
    [ 
        check("id", "Cédula requerida").not().isEmpty(),
        check("nationality", "Nacionalidad requerida").not().isEmpty(),
        check("name", "Nombre requerido").not().isEmpty(),
        check("last_name", "apellido requerido").not().isEmpty(),
        check("direction", "Dirección requerida").not().isEmpty(),
        check("tel", "Telefono requerido").not().isEmpty(),
        check("cel", "Celular requerido").not().isEmpty(),
        validate_fields,
    ], 
    register
);

module.exports = router;