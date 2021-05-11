const { Router } = require('express');
const { check } = require('express-validator');
const { validate_fields } = require('../middlewares/Validate-fields');

const multer = require('multer');
const md_auth = require('../middlewares/Authenticated');
const router = Router();

const {
  saveAnimalType,
  getTypes,
  removeType,
  register,
  update,
  changeStatus,
  changeNextDueDate,
  getAnimalByType,
  getAnimalByStatus,
  getAnimalByStatusAndType,
  getAnimal,
  uploadImgProfile,
  uploadImgReg
} = require('../controllers/Animal.js');

const {
  addRegisterMilk,
  deleteRegisterMilk
} = require('../controllers/Milk.js');

const {
  addRegisterCalving,
  deleteRegisterCalving
} = require('../controllers/Calving.js');

const {
  addRegisterWeight,
  deleteRegisterWeight
} = require('../controllers/Weight.js');

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  }
});

const upload = multer({ storage }).single('image');

router.post('/subir/foto-de-perfil/:id', [md_auth.authenticated, upload], uploadImgProfile);
router.post('/subir/foto-de-registro/:id', [md_auth.authenticated, upload], uploadImgReg);
router.post(
  '/registrar-tipo',
  [
    check('name', 'Nombre  Requerido ').not().isEmpty(),
    check('gender', 'Genero requerido').not().isEmpty(),
    validate_fields
  ],
  md_auth.authenticated,
  saveAnimalType
);

router.get('/ver-tipos', md_auth.authenticated, getTypes);

router.delete('/remover-tipo/:id', md_auth.authenticated, removeType);

router.post(
  '/registrar',
  md_auth.authenticated,
  [
    check('plate_number', 'Numero de chapa requerida requerida').not().isEmpty(),

    check('date_admission', 'La fecha de registro es requerida').not().isEmpty(),

    check('type_animal', 'Tipo de animal  requerido').not().isEmpty(),
    check('status', 'El estado es requerido').not().isEmpty(),
    validate_fields
  ],
  register
);

router.put(
  '/actualizar/:id',
  md_auth.authenticated,
  [
    check('plate_number', 'Numero de chapa requerida requerida').not().isEmpty(),

    check('date_admission', 'La fecha de registro es requerida').not().isEmpty(),

    check('type_animal', 'Tipo de animal  requerido').not().isEmpty(),
    check('status', 'El estado es requerido').not().isEmpty(),
    validate_fields
  ],
  update
);

router.get('/ver-animal/:id', md_auth.authenticated, getAnimal);

router.put(
  '/actualizar-estado/:id',
  md_auth.authenticated,
  [check('status', 'Estado no recibido').not().isEmpty(), validate_fields],
  changeStatus
);

router.put(
  '/actualizar/fecha-proxima-de-parto/:id',
  md_auth.authenticated,
  [check('next_due_date', 'Fecha no recibida').not().isEmpty(), validate_fields],
  changeNextDueDate
);

router.get('/tipo/:type/:page?', md_auth.authenticated, getAnimalByType);
router.get('/estado/:status/:page?', md_auth.authenticated, getAnimalByStatus);
router.get('/tipo/:type/estado/:status/:page?', md_auth.authenticated, getAnimalByStatusAndType);

//Rutas de MIlk
router.post(
  '/registar-leche/vaca/:id',
  md_auth.authenticated,
  [
    check('liters', 'Litros no recibidos').not().isEmpty(),
    check('registration_date', 'Fecha no recibida').not().isEmpty(),
    validate_fields
  ],
  addRegisterMilk
);

router.delete(
  '/vaca/:cow/eliminar-registro/leche/:milk',
  md_auth.authenticated,
  deleteRegisterMilk
);

//rutas de Calving

router.post(
  '/registar-parto/animal/:id',
  md_auth.authenticated,
  [
    check('date', 'Fecha no recibida').not().isEmpty(),
    check('complications', 'Complicaciones no recibidas').not().isEmpty(),
    validate_fields
  ],
  addRegisterCalving
);

router.delete('/:animal/eliminar-parto/:calving', md_auth.authenticated, deleteRegisterCalving);

//rutas de Weight

router.post(
  '/:animal/registar-peso',
  md_auth.authenticated,
  [
    check('weight', 'Peso no recibido').not().isEmpty(),
    check('date', 'Fecha no recibida').not().isEmpty(),
    check('observations', 'Observaciones no recibidas').not().isEmpty(),
    validate_fields
  ],
  addRegisterWeight
);

router.delete('/:animal/eliminar-peso/:weight', md_auth.authenticated, deleteRegisterWeight);

module.exports = router;
