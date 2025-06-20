const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidate, validateJWT, haveRol } = require("../middlewares");

const {
  isRolValid,
  isEmailValid,
  isUserById,
} = require("../helpers/db-validators");
const {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch,
} = require("../controllers/users.controllers");

const router = Router();

router.get("/", usersGet);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("rol").custom(isRolValid), // Custom validator to check if the role is valid
    check("email", "Email is not valid").isEmail(),
    check("email").custom(isEmailValid), // Custom validator to check if the email is already registered
    fieldsValidate,
  ],
  usersPost,
);

router.put(
  "/:id",
  [
    check("id", "Invalid ID format").isMongoId(),
    check("id").custom(isUserById), // Custom validator to check if the user exists by ID
    check("rol").custom(isRolValid), // Custom validator to check if the role is valid

    fieldsValidate,
  ],
  usersPut,
);
router.delete(
  "/:id",
  [
    validateJWT, // Middleware to validate JWT token
    // isAdminRol,
    haveRol("ADMIN_ROLE", "SALES_ROLE"), // Middleware to check if the user has the required role
    check("id", "Invalid ID format").isMongoId(),
    check("id").custom(isUserById), // Custom validator to check if the user exists by ID
    fieldsValidate,
  ],
  usersDelete,
);
router.patch("/", usersPatch);

module.exports = router;
