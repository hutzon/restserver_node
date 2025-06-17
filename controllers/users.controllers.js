const { response } = require("express");

const usersGet = (req, res = response) => {
  const query = req.query; // Access query parameters
  res.json({
    ok: true,
    message: "API is working, method: GET since Controllers",
    query,
  });
};

const usersPut = (req, res = response) => {
  const id = req.params.id; // Assuming you want to get an ID from the request parameters

  res.status(201).json({
    ok: true,
    message: "API is working, method: PUT since Controllers",
    id,
  });
};

const usersPost = (req, res = response) => {
  const { nombre, edad } = req.body; // Access the request body
  res.status(201).json({
    ok: true,
    message: "API is working, method: POST since Controllers",
    nombre,
    edad,
  });
};

const usersDelete = (req, res = response) => {
  res.json({
    ok: true,
    message: "API is working, method: DELETE since Controllers",
  });
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
