"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../database/db");
const skill = require("./Skill");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../../config");

const user = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  hash: { type: Sequelize.TEXT },
  salt: Sequelize.STRING(1000),
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  country: Sequelize.STRING,
  state: Sequelize.STRING,
  citty: Sequelize.STRING,

  emailprivacy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  phonenumber: Sequelize.STRING,
  phonenumberprivacy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  whatsappnumber: Sequelize.STRING,
  whatsappnumberprivacy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  connectionprivacy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  birthdate: Sequelize.DATE,
  gender: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  occupation: Sequelize.STRING,
  photo: Sequelize.STRING,
  islearner: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isguide: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  bio: Sequelize.STRING,
  iscolearner: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

user.prototype.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  };
};

user.prototype.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  try {
    return jwt.sign(
      {
        id: this.id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
      },
      config.auth.secret,
      { algorithm: config.auth.algorithm }
    );
  } catch (ex) {
    console.log("Exception:" + ex);

    return ex;
  }
};

user.prototype.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");

  return this.hash === hash;
};

user.hasMany(skill);

module.exports = user;
