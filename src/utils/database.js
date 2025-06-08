// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "test123-",
//   database: "node-shop",
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("node-shop", "root", "test123-", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
