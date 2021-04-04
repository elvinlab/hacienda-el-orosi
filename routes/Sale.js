const { Router } = require ('express');
const { check } = require ('express-validator');
const { validate_fields } = require( '../middlewares/Validate-fields' );

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const {
    make,
} = require ('../controllers/Sale.js');

router.post(
    '/realizar-venta',
    [
        check("animal_id", "El animal es requerido").not().isEmpty(),
        check("type_sale", "El tipo de venta es requerido").not().isEmpty(),
        check("buyer_name", "Nombre del comprador es requerido").not().isEmpty(),
        validate_fields,
    ],
    md_auth.authenticated,
    make
);
module.exports = router;