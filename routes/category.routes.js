const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidate } = require("../middlewares/fields-validate");
const { validateJWT, haveRol } = require("../middlewares");
const category = require("../models/category");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controllers");
const { isCategoryById } = require("../helpers/db-validators");

const router = Router();

//get all categories
router.get("/", [validateJWT], getCategories);

//get category by id
router.get(
  "/:id",
  [
    check("id", "Invalid ID format").isMongoId(),
    check("id").custom(isCategoryById),
    fieldsValidate,
  ],
  getCategory,
);

//create a new category
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    fieldsValidate,
  ],
  createCategory,
);

//update a category by id
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("id").custom(isCategoryById),
    fieldsValidate,
  ],
  updateCategory,
);

//delete a category by id changing status to false
router.delete(
  "/:id",
  [
    validateJWT,
    haveRol("ADMIN_ROLE"),
    check("id", "Invalid ID format").isMongoId(),
    fieldsValidate,
    check("id").custom(isCategoryById),
  ],
  deleteCategory,
);

module.exports = router;
