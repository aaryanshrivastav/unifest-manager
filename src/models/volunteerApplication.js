const { getConnection } = require('../config/db');

function generateApplicationId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return 'APP' + randomNum;
}

async function createTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE volunteer_application (
        application_id VARCHAR2(20) PRIMARY KEY,
        user_id VARCHAR2(20) NOT NULL,
        role_id VARCHAR2(20) NOT NULL,
        date_created DATE DEFAULT SYSDATE,
        description VARCHAR2(255),
        reviewed_by VARCHAR2(20),
        status VARCHAR2(20) DEFAULT 'PENDING',
        CONSTRAINT fk_vol_app_user FOREIGN KEY (user_id) REFERENCES users(user_id),
        CONSTRAINT fk_vol_app_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
        CONSTRAINT fk_vol_app_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
      )
    `);
    await connection.commit();
    console.log('volunteer_application table created');
  } catch (err) {
    console.error('Error creating volunteer_application table:', err);
  } finally {
    await connection.close();
  }
}

module.exports = { generateApplicationId, createTable };
