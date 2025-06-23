const fieldsValidate = require("./fields-validate");
const validateJWT = require("./jwt-validate");
const rolValidate = require("./rol-validate");

module.exports = {
  ...fieldsValidate,
  ...validateJWT,
  ...rolValidate, // Spread operator to include all exports from rol-validate
};
