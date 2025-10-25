import { getConnection } from '../config/db.js';

export async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE venues (
        venue_id VARCHAR2(20) PRIMARY KEY,
        name VARCHAR2(100) NOT NULL,
        capacity NUMBER,
        facilities VARCHAR2(255),
        location VARCHAR2(255),
        status VARCHAR2(20) DEFAULT 'AVAILABLE'
      )
    `);

    await connection.execute(`
      CREATE TABLE roles (
        role_id VARCHAR2(20) PRIMARY KEY,
        name VARCHAR2(50) NOT NULL,
        count NUMBER DEFAULT 0
      )
    `);

    await connection.commit();
    console.log('venues and roles tables created');
  } catch (err) {
    console.error('Error creating venues/roles tables:', err);
  } finally {
    await connection.close();
  }
}
