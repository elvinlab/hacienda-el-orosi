const { Router } = require ( 'express' );
const { check } = require ( 'express-validator' );
const { validate_fields } = require( '../middelewares/Validate-fields' );

const router = Router();

const { 
    register,
    } = require( '../controllers/Colaborador.js');

router.post( 
    '/registrar-colaborador',
    [ 
        check("cedula", "Cédula requerida").not().isEmpty(),
        check("nacionalidad", "Nacionalidad requerida").not().isEmpty(),
        check("nombre", "Nombre requerido").not().isEmpty(),
        check("apellido", "apellido requerido").not().isEmpty(),
        check("direccion", "Dirección requerida").not().isEmpty(),
        check("telefono", "Telefono requerido").not().isEmpty(),
        check("celular", "Celular requerido").not().isEmpty(),
        validate_fields,
    ], 
    register
);

module.exports = router;