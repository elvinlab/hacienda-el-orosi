const { Router } = require("express");
const { check } = require("express-validator");
const { validate_fields } = require("../middlewares/Validate-fields");

const md_auth = require("../middlewares/Authenticated");
const router = Router();

const {
  save,
  update,
  getProducts,
  remove,
} = require("../controllers/Product.js");

router.post(
  "/guardar-producto",
  [
    check("name", "Nombre del producto requerido").not().isEmpty(),
    check("price", "Precio del producto requerido").not().isEmpty(),

    validate_fields,
  ],
  md_auth.authenticated,
  save
);

router.put(
  "/modificar-producto/:id",
  check("name_product", "Nombre del producto requerido").not().isEmpty(),
  check("price_product", "Precio del producto requerido").not().isEmpty(),
  md_auth.authenticated,
  update
);

router.get("/listar-productos/:page", md_auth.authenticated, getProducts);
router.delete("/remover-producto/:id", md_auth.authenticated, remove);

module.exports = router;
