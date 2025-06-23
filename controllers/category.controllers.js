const { request } = require("express");
const { Category } = require("../models");

const createCategory = async (req, res = request) => {
  const name = req.body.name.toUpperCase(); // Get the category name from the request body and convert it to uppercase
  console.log(name); // Log the category name for debugging

  try {
    // Create a new category in the database
    const categoryDB = await Category.findOne({ name });
    if (categoryDB) {
      return res.status(400).json({
        message: `Category ${name} already exists`,
      });
    }

    const data = {
      name,
      user: req.user._id, // Assuming you have user authentication and req.user is populated
      status: true, // Default status is true
    };

    const category = new Category(data); // Create a new category instance
    await category.save(); // Save the category to the database
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
};

//getCategories - paginate - total - populate
const getCategories = async (req, res = request) => {
  const { limit = 5, from = 0 } = req.query; // Get pagination parameters from the query string
  const query = { status: true }; // Query to find active categories
  // Validate limit and from
  if (isNaN(limit) || isNaN(from)) {
    return res.status(400).json({
      message: "Limit and from must be numbers",
    });
  }

  try {
    // Fetch total count and categories in parallel
    const [total, categories] = await Promise.all([
      Category.countDocuments(query), // Count total active categories
      Category.find(query) // Fetch active categories
        .skip(Number(from)) // Skip the specified number of documents
        .limit(Number(limit)) // Limit the number of documents returned
        .populate("user", "name"), // Populate user field with name
    ]);
    res.json({
      total,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

//getCategory = populate{}
const getCategory = async (req, res = request) => {
  const { id } = req.params;
  try {
    // Fetch category by ID from the database
    const category = await Category.findById(id).populate("user", "name");
    if (!category || !category.status) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category",
      error: error.message,
    });
  }
};

//update Category
const updateCategory = async (req, res = request) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase(); // Convert name to uppercase
  data.user = req.user._id; // Set the user to the authenticated user
  try {
    // Update category by ID in the database
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};

//delete Category - update status to false
const deleteCategory = async (req, res = request) => {
  const { id } = req.params;
  try {
    // Update category status to false (soft delete)
    const category = await Category.findByIdAndUpdate(
      id,
      { status: false }, // Set status to false
      { new: true }, // Return the updated document
    );

    res.json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
