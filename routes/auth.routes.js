const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth.controllers");
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

router.post(
  "/google",
  [check("id_token", "id_token is required").not().isEmpty(), fieldsValidate],
  googleSignIn,
);

module.exports = router;
