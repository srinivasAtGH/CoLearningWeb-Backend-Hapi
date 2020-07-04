"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const skill = sequelize.define("Skill", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  skillname: Sequelize.STRING,
});

module.exports = skill;
