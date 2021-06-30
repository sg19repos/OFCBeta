const { createPool } = require("mysql2");

const pool = createPool({
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  connectionLimit:10
});

module.exports = pool;
