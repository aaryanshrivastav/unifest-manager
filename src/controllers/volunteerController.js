import { getConnection } from "../config/db.js";

// 1️⃣ Home: profile + events registered
export const getVolunteerHome = async (req, res) => {
  try {
    const { volunteer_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, name, email, role 
       FROM users WHERE user_id = :volunteer_id`,
      { volunteer_id }
    );

    const eventsResult = await connection.execute(
      `SELECT e.event_id, e.event_name, e.start_time 
       FROM volunteer_assignment va
       JOIN events e ON va.event_id = e.event_id
       WHERE va.volunteer_id = :volunteer_id`,
      { volunteer_id }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ message: "Volunteer not found" });

    const [userId, name, email, role] = userResult.rows[0];

    res.status(200).json({
      volunteer: { user_id: userId, name, email, role },
      events: eventsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching home data" });
  }
};

// 2️⃣ All Events
export const getVolunteerEvents = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM events WHERE status = 'APPROVED'`
    );
    await connection.close();

    res.status(200).json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// 3️⃣ Shift Info
export const getVolunteerShifts = async (req, res) => {
  try {
    const { volunteer_id } = req.params;
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT e.event_name, va.role_id, va.shoft_start, va.shift_end
       FROM volunteer_assignment va
       JOIN events e ON va.event_id = e.event_id
       WHERE va.volunteer_id = :volunteer_id`,
      { volunteer_id }
    );

    await connection.close();

    res.status(200).json({ shifts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shifts" });
  }
};
