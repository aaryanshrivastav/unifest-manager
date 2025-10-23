const { getConnection } = require('../config/db');

function generateAssignmentId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return 'ASN' + randomNum;
}

async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE volunteer_assignment (
        assignment_id VARCHAR2(20) PRIMARY KEY,
        volunteer_id VARCHAR2(20) NOT NULL,
        event_id VARCHAR2(20) NOT NULL,
        role_id VARCHAR2(20) NOT NULL,
        shift_start TIMESTAMP,
        shift_end TIMESTAMP,
        status VARCHAR2(20) DEFAULT 'ASSIGNED',
        CONSTRAINT fk_vol_assign_user FOREIGN KEY (volunteer_id) REFERENCES users(user_id),
        CONSTRAINT fk_vol_assign_event FOREIGN KEY (event_id) REFERENCES event(event_id),
        CONSTRAINT fk_vol_assign_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
      )
    `);
    await connection.commit();
    console.log('volunteer_assignment table created');
  } catch (err) {
    console.error('Error creating volunteer_assignment table:', err);
  } finally {
    await connection.close();
  }
}

module.exports = { generateAssignmentId, createTable };
