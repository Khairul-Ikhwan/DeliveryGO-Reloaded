const { Pool } = require('pg');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

const pool = new Pool({
  connectionString,
  keepAlive: true,
  keepAliveInitialDelayMillis: 30000, // Delay before first keep-alive query (30 seconds)
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((error) => console.error('Error connecting to PostgreSQL database:', error));

module.exports = pool;
