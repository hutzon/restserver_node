const { request } = require("express");
const { Product } = require("../models");

//getProducts - paginate - total - populate
const getProducts = async (req, res = request) => {
  const { limit = 5, from = 0 } = req.query; // Get pagination parameters from the query string
  const query = { status: true }; // Query to find active products
  // Validate limit and from
  if (isNaN(limit) || isNaN(from)) {
    return res.status(400).json({
      message: "Limit and from must be numbers",
    });
  }

  try {
    // Fetch total count and products in parallel
    const [total, products] = await Promise.all([
      Product.countDocuments(query), // Count total active products
      Product.find(query) // Fetch active products
        .populate("user", "name") // Populate user field with name
        .populate("category", "name") // Populate category field with name
        .skip(Number(from)) // Skip the specified number of documents
        .limit(Number(limit)), // Limit the number of documents returned
    ]);
    res.json({
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

//getProduct = populate{}
const getProduct = async (req, res = request) => {
  const { id } = req.params;
  try {
    // Fetch product by ID from the database
    const product = await Product.findById(id)
      .populate("user", "name") // Populate user field with name
      .populate("category", "name"); // Populate category field with name;
    if (!product || !product.status) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const createProduct = async (req, res = request) => {
  const { status, user, ...body } = req.body; // Get the data from the request body

  try {
    // Create a new product in the database
    const productDB = await Product.findOne({ name: body.name });
    console.log(productDB);
    if (productDB) {
      return res.status(400).json({
        message: `Product ${productDB.name} already exists`,
      });
    }

    const data = {
      ...body, // Spread the body to include all fields
      name: body.name.toUpperCase(), // Convert name to uppercase
      user: req.user._id, // Assuming you have user authentication and req.user is populated
      status: true, // Default status is true
    };

    const product = new Product(data); // Create a new product instance
    await product.save(); // Save the product to the database
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

//update Product
const updateProduct = async (req, res = request) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase(); // Convert name to uppercase
  }

  data.user = req.user._id; // Set the user to the authenticated user
  try {
    // Update product by ID in the database
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

//delete Product - update status to false
const deleteProduct = async (req, res = request) => {
  const { id } = req.params;
  try {
    // Update product status to false (soft delete)
    const product = await Product.findByIdAndUpdate(
      id,
      { status: false }, // Set status to false
      { new: true }, // Return the updated document
    );

    res.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
