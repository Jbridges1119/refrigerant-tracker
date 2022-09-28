const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const pool = new Pool(dbParams);
pool.connect();

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
