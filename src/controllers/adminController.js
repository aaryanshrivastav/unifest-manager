import { getConnection } from "../config/db.js";

// 1️⃣ Admin Home: profile + counts
export const getAdminHome = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const connection = await getConnection();

    const profileResult = await connection.execute(
      `SELECT user_id, name, email, role FROM users WHERE user_id = :admin_id`,
      { admin_id }
    );

    const countsResult = await connection.execute(
      `SELECT
        (SELECT COUNT(*) FROM events WHERE approval_status = 'PENDING') AS pending_events,
        (SELECT COUNT(*) FROM volunteer_application WHERE status = 'PENDING') AS pending_volunteers,
        (SELECT COUNT(*) FROM venues) AS total_venues,
        (SELECT COUNT(*) FROM users WHERE role = 'COORDINATOR') AS total_coordinators,
        (SELECT COUNT(*) FROM users WHERE role = 'VOLUNTEER') AS total_volunteers,
        (SELECT COUNT(*) FROM users WHERE role = 'FACULTY') AS total_faculty
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
  try {
    const { type } = req.query; // type='events' or 'volunteers'
    const connection = await getConnection();
    let result;

    if (type === "events") {
      result = await connection.execute(
        `SELECT event_id, event_name, coordinator_id, status, approval_status 
         FROM events
         WHERE approval_status = 'PENDING'`
      );
    } else if (type === "volunteers") {
      result = await connection.execute(
        `SELECT application_id, user_id, role_id, date, description, status
         FROM volunteer_application
         WHERE status = 'PENDING'`
      );
    } else {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    await connection.close();
    res.status(200).json({ approvals: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching approvals" });
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
        result = await connection.execute(`SELECT * FROM events`);
        break;
      case "venues":
        result = await connection.execute(`SELECT * FROM venues`);
        break;
      case "volunteers":
        result = await connection.execute(`SELECT * FROM users WHERE role = 'VOLUNTEER'`);
        break;
      case "coordinators":
        result = await connection.execute(`SELECT * FROM users WHERE role = 'COORDINATOR'`);
        break;
      case "faculty":
        result = await connection.execute(`SELECT * FROM users WHERE role = 'FACULTY'`);
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
