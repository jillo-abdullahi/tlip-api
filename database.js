require("dotenv").config();
const { Pool } = require("pg");

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

if (process.env.DB_PASSWORD) {
  config.password = process.env.DB_PASSWORD;
}

const pool = new Pool(config);

module.exports = pool;
