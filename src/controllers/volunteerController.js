import { getConnection } from "../config/db.js";
import oracledb from "oracledb";

// 1️⃣ Home: profile + events registered
export const getVolunteerHome = async (req, res) => {
  try {
    const { volunteer_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, first_name, last_name, email, role_type 
       FROM users WHERE user_id = :volunteer_id`,
      { volunteer_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const eventsResult = await connection.execute(
      `SELECT 
         e.event_id,
         e.event_name,
         e.start_time,
         e.end_time,
         e.venue_id
       FROM volunteer_assignment va
       JOIN event e ON va.event_id = e.event_id
       WHERE va.volunteer_id = :volunteer_id`,
      { volunteer_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ message: "Volunteer not found" });

    const u = userResult.rows[0];
    const name = [u.FIRST_NAME, u.LAST_NAME].filter(Boolean).join(' ').trim() || u.FIRST_NAME || 'Volunteer';

    res.status(200).json({
      volunteer: { user_id: u.USER_ID, name, email: u.EMAIL, role: u.ROLE_TYPE },
      events: eventsResult.rows.map(r => ({
        event_id: r.EVENT_ID,
        event_name: r.EVENT_NAME,
        start_time: r.START_TIME,
        end_time: r.END_TIME,
        venue_id: r.VENUE_ID,
      })),
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
      `SELECT event_id, event_name, start_time, end_time, venue_id 
       FROM event 
       WHERE approval_status = 'APPROVED'`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();

    res.status(200).json({ events: result.rows.map(r => ({
      event_id: r.EVENT_ID,
      event_name: r.EVENT_NAME,
      start_time: r.START_TIME,
      end_time: r.END_TIME,
      venue_id: r.VENUE_ID,
    })) });
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
      `SELECT e.event_name, va.role_id, va.shift_start, va.shift_end
       FROM volunteer_assignment va
       JOIN event e ON va.event_id = e.event_id
       WHERE va.volunteer_id = :volunteer_id`,
      { volunteer_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    res.status(200).json({ shifts: result.rows.map(r => ({
      event_name: r.EVENT_NAME,
      role_id: r.ROLE_ID,
      start_time: r.SHIFT_START,
      end_time: r.SHIFT_END,
    })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shifts" });
  }
};
