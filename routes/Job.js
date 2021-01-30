const { Router } = require ( 'express' );
const { check } = require ( 'express-validator' );
const { validate_fields } = require( '../middelewares/Validate-fields' );

const router = Router();

const { 
    save,
    } = require( '../controllers/Job.js');

    router.post( 
        '/registrar-trabajo',
        [ 
            check("name_job", "Nombre del trabajo Requerido ").not().isEmpty(),
            check("description", "Descripción requerida").not().isEmpty(),
            check("work_hours", "Horas de trabajo requerido").not().isEmpty(),
            check("extra_hours", "Horas extra requerido").not().isEmpty(),
            check("price_day", "Precio del día requerida").not().isEmpty(),
           
            validate_fields,
        ], 
        save
    );
    
    module.exports = router;