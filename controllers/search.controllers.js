const { response } = require("express");
const { User, Product, Category } = require("../models");
const { ObjectId } = require("mongoose").Types;

const validColections = ["users", "categories", "products", "orders", "rols"];

// Function to search users by term
const searchUsers = async (term = "", res = response) => {
  // Logic to search users by term
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.status(200).json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i"); // Case-insensitive search
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  res.status(200).json({
    results: users,
  });

  return [];
};

//Function to search categories by term
const searchCategories = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const category = await Category.findById(term);
    return res.status(200).json({
      results: category ? [category] : [],
    });
  }
  const regex = new RegExp(term, "i"); // Case-insensitive search
  const categories = await Category.find({
    name: regex,
    status: true,
  });
  res.status(200).json({
    results: categories,
  });
  return [];
};

//Function to search products by term
const searchProducts = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const product = await Product.findById(term).populate("category", "name");
    return res.status(200).json({
      results: product ? [product] : [],
    });
  }
  const regex = new RegExp(term, "i"); // Case-insensitive search
  const products = await Product.find({
    name: regex,
    status: true,
  }).populate("category", "name");
  res.status(200).json({
    results: products,
  });
  return [];
};

const search = (req, res = response) => {
  const { colection, term } = req.params;

  if (!validColections.includes(colection)) {
    return res.status(400).json({
      message: `Invalid collection. Valid collections are: ${validColections.join(
        ", ",
      )}`,
    });
  }

  switch (colection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      return res.status(400).json({ message: "Invalid collection" });
  }
};

module.exports = {
  search,
};
