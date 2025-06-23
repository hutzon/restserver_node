const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidate } = require("../middlewares/fields-validate");
const { validateJWT, haveRol } = require("../middlewares");
const product = require("../models/product");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controllers");
const { isProductById, isCategoryById } = require("../helpers/db-validators");

const router = Router();

//get all Products
router.get("/", getProducts);

//get product by id
router.get(
  "/:id",
  [
    check("id", "Invalid ID format").isMongoId(),
    check("id").custom(isProductById),
    fieldsValidate,
  ],
  getProduct,
);

//create a new product
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("category", "It's not Mongo id").isMongoId(),
    check("category").custom(isCategoryById),
    fieldsValidate,
  ],
  createProduct,
);

//update a product by id
router.put(
  "/:id",
  [
    validateJWT,
    // check("category", "It's not Mongo id").isMongoId(),
    check("id").custom(isProductById),
    fieldsValidate,
  ],
  updateProduct,
);

//delete a product by id changing status to false
router.delete(
  "/:id",
  [
    validateJWT,
    haveRol("ADMIN_ROLE"),
    check("id", "Invalid ID format").isMongoId(),
    fieldsValidate,
    check("id").custom(isProductById),
  ],
  deleteProduct,
);

module.exports = router;
