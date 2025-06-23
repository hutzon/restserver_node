const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid }; // Payload can include uid ID or other identifying information
    console.log("desde jwt-generate", process.env.JWT_SECRET); // Log the secret key for debugging purposes

    // Sign the JWT with a secret key and an expiration time
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: "2h" }, // Token expiration time
      (err, token) => {
        if (err) {
          console.error("Error generating JWT:", err);
          reject("Could not generate JWT");
        } else {
          resolve(token); // Resolve the promise with the generated token
        }
      },
    );
  });
};

module.exports = {
  generateJWT,
};
