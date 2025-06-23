const { Schema, model } = require("mongoose");

const RolSchema = Schema({
  rol: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
});

module.exports = model("Rol", RolSchema);
