const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "test123-",
  database: "node-shop",
});

module.exports = pool.promise();
