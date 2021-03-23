const { response } = require ( 'express' );
const { validationResult } = require ( 'express-validator' );

const validate_fields = (req, res = response, next )=>{
    const errors = validationResult( req );

    if ( !errors.isEmpty() ){
        return res.status( 400 ).json({
            status: 'Error',
            msg: errors.mapped(),
        });
    } 

    next();
}

module.exports = {validate_fields};