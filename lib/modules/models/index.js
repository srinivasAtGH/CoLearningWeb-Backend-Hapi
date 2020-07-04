const Sequelize = require("sequelize");
const User = require("./User");

const register = (server, options, next) => {
  server.app.db = {
    User: User,
  };

  return next();
};

register.attributes = {
  pkg: require("./package.json"),
};

module.exports = register;
