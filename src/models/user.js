const { getConnection } = require('../config/db');

const ROLE_PREFIX = {
  USER: 'STUD',
  VOLUNTEER: 'VOL',
  COORDINATOR: 'CORD',
  FACULTY: 'FACL',
  ADMIN: 'ADM'
};

function generateUserId(role) {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return ROLE_PREFIX[role] + randomNum;
}

async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE users (
        user_id VARCHAR2(20) PRIMARY KEY,
        first_name VARCHAR2(50) NOT NULL,
        last_name VARCHAR2(50),
        email VARCHAR2(100) UNIQUE NOT NULL,
        phone VARCHAR2(15),
        password VARCHAR2(255) NOT NULL,
        role_type VARCHAR2(20) CHECK (role_type IN ('USER','VOLUNTEER','COORDINATOR','FACULTY','ADMIN')),
        created_date DATE DEFAULT SYSDATE
      )
    `);
    await connection.commit();
    console.log('users table created');
  } catch (err) {
    console.error('Error creating users table:', err);
  } finally {
    await connection.close();
  }
}

module.exports = { generateUserId, ROLE_PREFIX, createTable };
