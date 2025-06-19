const { response } = require("express");
const User = require("../models/user"); // Assuming you have a User model defined
const bcrypt = require("bcryptjs");

const usersGet = async (req, res = response) => {
  //pagination users by 10
  const { limit = 5, from = 0 } = req.query; // Get limit and from from query parameters
  const query = { status: true };
  //validar limit and from
  if (isNaN(limit) || isNaN(from)) {
    return res.status(400).json({
      ok: false,
      message: "Limit and from must be numbers",
    });
  }
  // const users = await User.find(query).skip(Number(from)).limit(Number(limit)); // Fetch all users from the database

  // const total = await User.countDocuments(query); // Get the total number of users

  // Using Promise.all to fetch both total count and users in parallel
  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPut = async (req, res = response) => {
  const { id } = req.params; // Assuming you want to get an ID from the request parameters
  const { _id, password, google, email, ...rest } = req.body; // Get data from the request body

  //Todo - Validate the ID and update the user in the database
  if (password) {
    // If password is provided, hash it before saving
    const salt = bcrypt.genSaltSync(); // Generate a salt
    rest.password = bcrypt.hashSync(password, salt); // Hash the password with the salt
  }

  const user = await User.findByIdAndUpdate(id, rest, { new: true }); // Update the user in the database
  if (!user) {
    return res.status(404).json({
      ok: false,
      message: "User not found",
    });
  }

  res.status(201).json({
    ok: true,
    message: "API is working, method: PUT since Controllers",
    user,
  });
};

const usersPost = async (req, res = response) => {
  const { name, password, email, rol } = req.body;

  const user = new User({
    name,
    password,
    email,
    rol,
  });

  // Hash the password before saving
  const salt = bcrypt.genSaltSync(); // Generate a salt
  user.password = bcrypt.hashSync(password, salt); // Hash the password with the salt

  await user.save(); // Save the user to the database
  res.status(201).json({
    user,
  });
};

const usersDelete = async (req, res = response) => {
  const { id } = req.params; // Assuming you want to get an ID from the request parameters

  //delete user by id completely
  // const user = await User.findByIdAndDelete(id); // Delete the user from the database

  //delete user by id logically
  const user = await User.findByIdAndUpdate(id, { status: false }); // Update the user's status to false (logically delete)

  res.json(user);
};

const usersPatch = (req, res = response) => {
  res.json({
    ok: true,
    message: "API is working, method: PATCH since Controllers",
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch,
};
