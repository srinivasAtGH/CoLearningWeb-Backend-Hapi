const config = require("../../config");
const { decode } = require("jsonwebtoken");

const register = (server, options, next) => {
  var validateFunc = (decode, request, callback) => {
    console.log("decoded id: " + decode.id);
    server.methods.services.users.getById(decode.id, (err, user) => {
      if (err) {
        console.log("Error: " + err.message);
        return callback(err, false);
      }
      if (!user) {
        return callback(null, false);
      }

      return callback(null, true, {
        user,
      });
    });
  };

  server.auth.strategy("jwt", "jwt", {
    key: config.auth.secret,
    validateFunc: validateFunc,
    //tokenType: config.auth.tokenType,
    verifyOptions: config.auth.verifyOptions,
  });

  return next();
};

register.attributes = {
  pkg: require("./package.json"),
};

module.exports = register;
