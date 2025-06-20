const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usersRoutePath = "/api/users";
    this.authPath = "/api/auth";

    // Database connection
    this.conectarDB();

    // Middleware
    this.middleware();

    // Routes
    this.routes();
  }

  async conectarDB() {
    // Connect to the database
    await dbConnection();
  }

  middleware() {
    //Cors
    this.app.use(cors()); // Enable CORS for all routes
    // Body parser to parse JSON requests
    this.app.use(express.json()); // For parsing application/json
    // Middleware can be added here, e.g., bodyParser, cors, etc.
    //directory for static files
    this.app.use(express.static("public")); // For parsing application/json
  }

  routes() {
    this.app.use(this.usersRoutePath, require("../routes/user.routes"));
    this.app.use(this.authPath, require("../routes/auth.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

module.exports = Server;
