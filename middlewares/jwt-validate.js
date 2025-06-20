const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming you have a User model defined

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  console.log("Token received:", token); // Log the received token for debugging

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      msg: "No token provided in the request",
    });
  }

  try {
    // Verify the token
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    //get user associated with the token
    const userAuthenticated = await User.findById(uid);

    // check ir user is status is true
    if (!userAuthenticated || !userAuthenticated.status) {
      return res.status(401).json({
        msg: "Token is not valid - user does not exist or is inactive",
      });
    }

    req.user = userAuthenticated; // Attach the user object to the request

    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  validateJWT,
};
