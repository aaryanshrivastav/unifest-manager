import { getConnection } from "../config/db.js";
import oracledb from 'oracledb';

// 1️⃣ Home: profile + 5 events registered
export const getHome = async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await getConnection();

    // Get user details
    const userResult = await connection.execute(
      `SELECT user_id, first_name, last_name, email, phone, role_type 
       FROM users WHERE user_id = :user_id`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!userResult.rows.length) {
      await connection.close();
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's registered events
    const eventsResult = await connection.execute(
      `SELECT e.event_id, e.event_name, e.start_time AS event_date,
          v.name AS venue
          FROM registrations r
          JOIN event e ON r.event_id = e.event_id
          JOIN venues v ON e.venue_id = v.venue_id
          WHERE r.user_id = :user_id
          ORDER BY e.start_time DESC`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    // Format user data
    const user = userResult.rows[0];
    // Format events data
    const events = eventsResult.rows.map(event => ({
      event_id: event.EVENT_ID,
      event_name: event.EVENT_NAME,
      event_date: event.EVENT_DATE,
      venue: event.VENUE
    }));

    res.status(200).json({
      user: {
        user_id: user.USER_ID,
        first_name: user.FIRST_NAME,
        last_name: user.LAST_NAME,
        email: user.EMAIL,
        phone: user.PHONE,
        role: user.ROLE_TYPE
      },
      events
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching home data" });
  }
};

// 2️⃣ All Events
export const getAllEvents = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM event`);

    // Convert rows to plain JS objects
    const events = await Promise.all(
      result.rows.map(async (row, i) => {
        const obj = {};
        result.metaData.forEach((col, j) => {
          obj[col.name.toLowerCase()] = row[j];
        });

        // ✅ Handle CLOB (description)
        if (obj.description && obj.description.iLob) {
          obj.description = await readClob(obj.description);
        }

        return obj;
      })
    );

    console.log({ events });
    res.status(200).json({ events });
  } catch (err) {
    console.error("❌ getAllEvents Error:", err);
    res.status(500).json({ message: "Error fetching events" });
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

// Utility function to read CLOB content as string
const readClob = async (lob) => {
  return new Promise((resolve, reject) => {
    let clobData = "";
    lob.setEncoding("utf8");
    lob.on("data", (chunk) => (clobData += chunk));
    lob.on("end", () => resolve(clobData));
    lob.on("error", (err) => reject(err));
  });
};


// 3️⃣ My Events
export const getMyEvents = async (req, res) => {
  let connection;
  try {
    const user_id = req.user.id; // From auth middleware
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT e.event_id,
              e.event_name,
              e.description,
              e.start_time AS event_date,
              v.name AS event_location
       FROM registrations r
       JOIN event e ON r.event_id = e.event_id
       JOIN venues v ON v.venue_id = e.venue_id
       WHERE r.user_id = :user_id
       ORDER BY e.start_time DESC`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const registrations = result.rows.map(reg => ({
      event_id: reg.EVENT_ID,
      event_name: reg.EVENT_NAME,
      description: reg.DESCRIPTION || "No description available",
      event_date: reg.EVENT_DATE,
      event_location: reg.EVENT_LOCATION
    }));

    res.status(200).json({
      success: true,
      registrations
    });
  } catch (err) {
    console.error("❌ getMyEvents Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching user events"
    });
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

// 4️⃣ Volunteer Application
export const submitApplication = async (req, res) => {
  try {
    const user_id = req.user.id; // From JWT in middleware
    const { year, description } = req.body;

    // 🎯 Determine role_id based on year
    const role_id = year && year.toLowerCase() === "first year" ? 1 : 2;

    const connection = await getConnection();
    const applicationId = "APP" + Math.floor(100000 + Math.random() * 900000);

    await connection.execute(
      `INSERT INTO volunteer_application 
        (application_id, user_id, role_id, description)
       VALUES (:application_id, :user_id, :role_id, :description)`,
      {
        application_id: applicationId,
        user_id,
        role_id,
        description,
      }
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({
      message: "Volunteer application submitted",
      application_id: applicationId,
    });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ message: "Error submitting application" });
  }
};
