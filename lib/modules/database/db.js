const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./colearningweb.sqlite",
});

sequelize.sync({ force: true }).then(() => {
  console.log(`Database & tables created!`);
});

module.exports = sequelize;
