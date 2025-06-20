const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt-generate");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body; // Get email and password from the request body

  try {
    //verify email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }

    //verify is user is active
    if (!user.status) {
      return res.status(400).json({
        msg: "User is not active - status: false",
      });
    }

    //verify password is correct
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }

    //generate JWT token
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    //verify the Google token
    const { email, name, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });
    if (!user) {
      // If user does not exist, create a new user
      const data = {
        name,
        email,
        password: ":P", // Placeholder password, as Google sign-in does not require a password
        img,
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    //if user exist but is not active
    if (!user.status) {
      return res.status(401).json({
        msg: "User is not active - status: false",
      });
    }

    //generate JWT token
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Google sign-in failed",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
