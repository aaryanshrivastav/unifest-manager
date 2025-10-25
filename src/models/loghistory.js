const { getConnection } = require('../config/db');

async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE log_history (
        log_id VARCHAR2(40) PRIMARY KEY,
        user_id VARCHAR2(20) NOT NULL,
        action VARCHAR2(20) CHECK (action IN ('LOGIN', 'LOGOUT')),
        timestamp DATE DEFAULT SYSDATE,
        ip_address VARCHAR2(50),
        CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES USERS(USER_ID)
      )
    `);
    await connection.commit();
    console.log('✅ log_history table created');
  } catch (err) {
    if (err.errorNum === 955) console.log('ℹ️ log_history already exists');
    else console.error('❌ Error creating log_history:', err);
  } finally {
    await connection.close();
  }
}

module.exports = { createTable };
