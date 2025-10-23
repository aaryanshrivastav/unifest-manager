const { getConnection } = require('../config/db');

function generateEventId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return 'EVE' + randomNum;
}

async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE event (
        event_id VARCHAR2(20) PRIMARY KEY,
        event_name VARCHAR2(100) NOT NULL,
        description CLOB,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        registration_start DATE,
        registration_end DATE,
        max_participants NUMBER,
        fees NUMBER(10,2),
        status VARCHAR2(20) DEFAULT 'ACTIVE',
        approval_status VARCHAR2(20) DEFAULT 'PENDING',
        venue_id VARCHAR2(20),
        faculty_id VARCHAR2(20),
        coordinator_id VARCHAR2(20),
        CONSTRAINT fk_event_venue FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
        CONSTRAINT fk_event_faculty FOREIGN KEY (faculty_id) REFERENCES users(user_id),
        CONSTRAINT fk_event_coordinator FOREIGN KEY (coordinator_id) REFERENCES users(user_id)
      )
    `);
    await connection.commit();
    console.log('event table created');
  } catch (err) {
    console.error('Error creating event table:', err);
  } finally {
    await connection.close();
  }
}

module.exports = { generateEventId, createTable };
