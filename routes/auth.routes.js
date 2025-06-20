const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth.controllers");
const { fieldsValidate } = require("../middlewares/fields-validate");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    fieldsValidate,
  ],
  login,
);

module.exports = router;
