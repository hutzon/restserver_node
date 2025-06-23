const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Error initializing the database connection");
  }
};

module.exports = {
  dbConnection,
};
