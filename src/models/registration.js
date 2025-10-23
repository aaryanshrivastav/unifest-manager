const crypto = require('crypto');
const { getConnection } = require('../config/db');

function generateRegistrationId() {
  return 'REG' + crypto.randomBytes(6).toString('hex');
}

async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE registrations (
        registration_id VARCHAR2(50) PRIMARY KEY,
        event_id VARCHAR2(20) NOT NULL,
        user_id VARCHAR2(20) NOT NULL,
        registered_on DATE DEFAULT SYSDATE,
        payment_status VARCHAR2(20) DEFAULT 'PENDING',
        attendance_status VARCHAR2(20) DEFAULT 'NOT_ATTENDED',
        CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES event(event_id),
        CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(user_id),
        CONSTRAINT uc_reg_unique UNIQUE (event_id, user_id)
      )
    `);
    await connection.commit();
    console.log('registrations table created');
  } catch (err) {
    console.error('Error creating registrations table:', err);
  } finally {
    await connection.close();
  }
}

module.exports = { generateRegistrationId, createTable };
