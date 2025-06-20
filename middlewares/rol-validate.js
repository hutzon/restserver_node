const { response } = require("express");

const isAdminRol = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Token validation is required before checking roles",
    });
  }

  const { role, name } = req.user;
  console.log("User role:", role); // Log the user role for debugging
  console.log("User name:", name); // Log the user name for debugging

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an administrator - Access denied`,
    });
  }

  next();
};

const haveRol = (...rols) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Token validation is required before checking roles",
      });
    }

    if (!rols.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service requires one of these roles: ${rols.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRol,
  haveRol,
};
