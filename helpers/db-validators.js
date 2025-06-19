const Rol = require("../models/rol");
const User = require("../models/user");

const isRolValid = async (rol = "") => {
  const existRol = await Rol.findOne({ rol });

  if (!existRol) {
    throw new Error(`Rol ${rol} is not registered in the database`);
  }
};

//this function checks if email exists in the database
const isEmailValid = async (email = "") => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`Email ${email} is already registered`);
  }
};

// If exist user by id
const isUserById = async (id) => {
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`User with ID ${id} does not exist`);
  }
};

module.exports = {
  isRolValid,
  isEmailValid,
  isUserById,
};
