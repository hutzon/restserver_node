const { Category, User, Rol, Product } = require("../models");

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

// if exist category by id
const isCategoryById = async (id) => {
  const existCategory = await Category.findById(id);
  if (!existCategory) {
    throw new Error(`Category with ID ${id} does not exist`);
  }
  // if (!existCategory.status) {
  //   throw new Error(`Category with ID ${id} is inactive`);
  // }
  return existCategory;
};

// if exist product by id
const isProductById = async (id) => {
  const existProduct = await Product.findById(id);
  if (!existProduct) {
    throw new Error(`Product with ID ${id} does not exist`);
  }
  // if (!existProduct.status) {
  //   throw new Error(`Product with ID ${id} is inactive`);
  // }
  return existProduct;
};

module.exports = {
  isRolValid,
  isEmailValid,
  isUserById,
  isCategoryById,
  isProductById,
};
