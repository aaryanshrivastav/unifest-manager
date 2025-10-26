// src/config/db.js
import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

let pool;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
};

export async function initDBPool() {
  if (!pool) {
    pool = await oracledb.createPool(dbConfig);
    console.log('OracleDB connection pool created');
  }
  return pool;
}

export async function getConnection() {
  if (!pool) await initDBPool();
  try {
    return await pool.getConnection();
  } catch (err) {
    console.error('OracleDB connection error:', err);
    throw err;
  }
}
