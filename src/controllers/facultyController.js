import { getConnection } from "../config/db.js";

// 1️⃣ Home: profile + limited events
export const getFacultyHome = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, name, email, role FROM users WHERE user_id = :faculty_id`,
      { faculty_id }
    );

    const eventsResult = await connection.execute(
      `SELECT event_id, event_name, start_time
       FROM events
       WHERE coordinator_id = :faculty_id
       FETCH FIRST 5 ROWS ONLY`,
      { faculty_id }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ message: "Faculty not found" });

    const [userId, name, email, role] = userResult.rows[0];

    res.status(200).json({
      faculty: { user_id: userId, name, email, role },
      events: eventsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching faculty home" });
  }
};

// 2️⃣ Register a new event
export const registerEvent = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const { event_name, description, start_time, end_time, registration_start, registration_end, max_participants, fees, venue_id } = req.body;

    const connection = await getConnection();

    const event_id = "EVE" + Math.floor(1000 + Math.random() * 9000);

    await connection.execute(
      `INSERT INTO events
        (event_id, event_name, description, start_time, end_time, registration_start, registration_end, max_participants, fees, status, approval_status, coordinator_id, venue_id)
       VALUES
        (:event_id, :event_name, :description, TO_DATE(:start_time,'YYYY-MM-DD HH24:MI'), TO_DATE(:end_time,'YYYY-MM-DD HH24:MI'),
         TO_DATE(:registration_start,'YYYY-MM-DD HH24:MI'), TO_DATE(:registration_end,'YYYY-MM-DD HH24:MI'),
         :max_participants, :fees, 'PENDING', 'PENDING', :faculty_id, :venue_id)`,
      { event_id, event_name, description, start_time, end_time, registration_start, registration_end, max_participants, fees, faculty_id, venue_id }
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
       FROM events
       WHERE coordinator_id = :faculty_id`,
      { faculty_id }
    );

    await connection.close();
    res.status(200).json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching faculty events" });
  }
};
