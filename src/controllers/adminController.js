import { getConnection } from "../config/db.js";
import oracledb from "oracledb";
// 1️⃣ Admin Home: profile + counts
export const getAdminHome = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const connection = await getConnection();

    const profileResult = await connection.execute(
      `SELECT user_id, first_name, email, role_type FROM users WHERE user_id = :admin_id`,
      { admin_id }
    );

    const countsResult = await connection.execute(
      `SELECT
        (SELECT COUNT(*) FROM event WHERE approval_status = 'PENDING') AS pending_events,
        (SELECT COUNT(*) FROM volunteer_application WHERE status = 'PENDING') AS pending_volunteers,
        (SELECT COUNT(*) FROM venues) AS total_venues,
        (SELECT COUNT(*) FROM users WHERE role_type = 'COORDINATOR') AS total_coordinators,
        (SELECT COUNT(*) FROM users WHERE role_type = 'VOLUNTEER') AS total_volunteers,
        (SELECT COUNT(*) FROM users WHERE role_type = 'FACULTY') AS total_faculty
       FROM dual`
    );

    await connection.close();

    if (!profileResult.rows.length)
      return res.status(404).json({ message: "Admin not found" });

    const [userId, name, email, role] = profileResult.rows[0];
    const counts = countsResult.rows[0];

    res.status(200).json({
      admin: { user_id: userId, name, email, role },
      counts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching admin home data" });
  }
};

// 2️⃣ Approval page: show pending events or volunteer applications
export const getApprovals = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const query = `
      SELECT application_id, user_id, role_id, description, status
      FROM volunteer_application
      WHERE status = 'PENDING'
    `;

    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (!result || !result.rows) {
      console.error("⚠️ Query returned no rows or failed:", result);
      return res.status(500).json({ success: false, message: "Query failed or returned nothing" });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ getApprovals Error:", err);
    res.status(500).json({ success: false, message: "Error fetching approvals" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
};


// 3️⃣ List page: show lists of any entity
export const getAdminLists = async (req, res) => {
  try {
    const { type } = req.query; // type='events', 'venues', 'volunteers', 'coordinators', 'faculty'
    const connection = await getConnection();
    let result;

    switch (type) {
      case "events":
        result = await connection.execute(
          `SELECT event_id, event_name, approval_status FROM event`,
          {},
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        break;
      case "venues":
        result = await connection.execute(
          `SELECT venue_id, name FROM venues`,
          {},
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        break;
      case "volunteers":
        result = await connection.execute(
          `SELECT user_id, first_name, last_name, email, role_type FROM users WHERE role_type = 'VOLUNTEER'`,
          {},
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        break;
      case "coordinators":
        result = await connection.execute(
          `SELECT user_id, first_name, last_name, email, role_type FROM users WHERE role_type = 'COORDINATOR'`,
          {},
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        break;
      case "faculty":
        result = await connection.execute(
          `SELECT user_id, first_name, last_name, email, role_type FROM users WHERE role_type = 'FACULTY'`,
          {},
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid type parameter" });
    }

    await connection.close();
    res.status(200).json({ list: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching list" });
  }
};
