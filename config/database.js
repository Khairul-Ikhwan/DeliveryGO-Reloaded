const { Pool } = require('pg');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

const pool = new Pool({
  connectionString,
  idleTimeoutMillis: 30000
});

module.exports = pool;
