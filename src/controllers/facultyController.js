import { getConnection } from "../config/db.js";
import oracledb from "oracledb";

export const getFacultyHome = async (req, res) => {
  let connection;

  try {
    const { faculty_id } = req.params;
    connection = await getConnection();

    const [userResult, eventsResult] = await Promise.all([
      connection.execute(
        `SELECT user_id, first_name, email, role_type 
         FROM users 
         WHERE user_id = :faculty_id`,
        { faculty_id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT event_id, event_name, start_time, end_time, description, approval_status
         FROM event
         WHERE faculty_id = :faculty_id
         ORDER BY start_time DESC
         FETCH FIRST 5 ROWS ONLY`,
        { faculty_id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
    ]);

    if (!userResult.rows?.length)
      return res.status(404).json({ message: "Faculty not found" });

    const faculty = userResult.rows[0];
    const events = (eventsResult.rows || []).map(e => ({
      event_id: e.EVENT_ID || e.event_id,
      event_name: e.EVENT_NAME || e.event_name,
      start_time: e.START_TIME ? new Date(e.START_TIME).toISOString() : null,
      end_time: e.END_TIME ? new Date(e.END_TIME).toISOString() : null,
      description: e.DESCRIPTION || e.description || null,
      approval_status: e.APPROVAL_STATUS || e.approval_status || null
    }));

    res.json({
      faculty: {
        user_id: faculty.USER_ID || faculty.user_id,
        name: faculty.FIRST_NAME || faculty.first_name,
        email: faculty.EMAIL || faculty.email,
        role: faculty.ROLE_TYPE || faculty.role_type
      },
      events
    });
  } catch (err) {
    console.error("❌ Faculty Home Error:", err);
    res.status(500).json({ message: "Error fetching faculty home" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.warn("⚠️ Error closing Oracle connection:", err.message);
      }
    }
  }
};


// 2️⃣ Register a new event
export const registerEvent = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const { event_name, description, start_time, end_time, registration_start, registration_end, max_participants, fees, venue_id } = req.body;

    const connection = await getConnection();

    const event_id = "EVE" + Math.floor(1000 + Math.random() * 9000);
    console.log({
  start_time,
  end_time,
  registration_start,
  registration_end
});

    await connection.execute(
      `INSERT INTO event (
    event_id, event_name, description,
    start_time, end_time,
    registration_start, registration_end,
    max_participants, fees, faculty_id, venue_id
  ) VALUES (
    :event_id, :event_name, :description,
    TO_TIMESTAMP(:start_time, 'YYYY-MM-DD HH24:MI:SS'),
    TO_TIMESTAMP(:end_time, 'YYYY-MM-DD HH24:MI:SS'),
    TO_DATE(:registration_start, 'YYYY-MM-DD'),
    TO_DATE(:registration_end, 'YYYY-MM-DD'),
    :max_participants, :fees, :faculty_id, :venue_id
  )`,
      { event_id, event_name, description, start_time, end_time, registration_start, registration_end, max_participants, fees, faculty_id, venue_id: null }
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({ message: "Event registered successfully", event_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering event" });
  }
};

// 3️⃣ All events by faculty
export const getFacultyEvents = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT event_id, event_name, start_time, end_time, approval_status
       FROM event
       WHERE faculty_id = :faculty_id`,
      { faculty_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    const events = (result.rows || []).map((r) => ({
      event_id: r.EVENT_ID || r.event_id,
      event_name: r.EVENT_NAME || r.event_name,
      start_time: r.START_TIME ? (r.START_TIME instanceof Date ? r.START_TIME.toISOString() : String(r.START_TIME)) : null,
      end_time: r.END_TIME ? (r.END_TIME instanceof Date ? r.END_TIME.toISOString() : String(r.END_TIME)) : null,
      approval_status: r.APPROVAL_STATUS || r.approval_status || null
    }));

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching faculty events" });
  }
};
