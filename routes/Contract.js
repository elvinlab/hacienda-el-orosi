const { Router } = require ( 'express' );
const { check } = require ( 'express-validator' );
const { validate_fields } = require( '../middelewares/Validate-fields' );

const md_auth = require("../middelewares/Authenticated");
const router = Router();

const { 
    save,
    getContracts,
    getContractsByContracted,
    changeStatus,
} = require ( '../controllers/Contract.js');

router.post(
    '/realizar-contracto',
    [
        check("name_contracted", "Nombre de la persona contratada Requerido ").not().isEmpty(),
        check("document_id", "Cedula requerida").not().isEmpty(),
        check("date_pay", "Fecha de pago requerido").not().isEmpty(),
        check("date_contract", "Fecha de contrato requerido").not().isEmpty(),
        check("name_job", "Nombre del trabajo requerido").not().isEmpty(),
        check("amount", "Pago requerido").not().isEmpty(),
        check("name_contracted", "Nonbre del trabajo a realizar requerido").not().isEmpty(),
        check("number_phone", "Numero de telefono requerido").not().isEmpty(),
        validate_fields,
    ],
    md_auth.authenticated,
    save
 );

 router.put(
    "/contrato/cambiar-estado/:id",
    [check("status", "Estado no recibido").not().isEmpty(), validate_fields],
    md_auth.authenticated,
    changeStatus
  );

 router.get("/ver-contratos/:status",  md_auth.authenticated,  getContracts );
 router.get("/ver-contratos/especificos/:status/:id",  md_auth.authenticated,  getContractsByContracted );

module.exports = router;