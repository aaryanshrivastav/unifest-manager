import { getConnection } from "../config/db.js";
import oracledb from "oracledb";

export const getCoordinatorHome = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, first_name, last_name, email, role_type FROM users WHERE user_id = :coordinator_id`,
      { coordinator_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const eventsResult = await connection.execute(
      `SELECT 
         e.event_id,
         e.event_name,
         e.start_time AS event_date,
         v.name AS venue
       FROM event e
       LEFT JOIN venues v ON e.venue_id = v.venue_id
       WHERE e.coordinator_id = :coordinator_id
       FETCH FIRST 5 ROWS ONLY`,
      { coordinator_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ message: "Coordinator not found" });

    const u = userResult.rows[0];
    const name = [u.FIRST_NAME, u.LAST_NAME].filter(Boolean).join(' ').trim() || u.FIRST_NAME || 'Coordinator';

    res.status(200).json({
      coordinator: { user_id: u.USER_ID, name, email: u.EMAIL, role: u.ROLE_TYPE },
      events: eventsResult.rows.map(r => ({
        event_id: r.EVENT_ID,
        event_name: r.EVENT_NAME,
        event_date: r.EVENT_DATE,
        venue: r.VENUE,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching home data" });
  }
};

export const assignVolunteers = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const { event_id, volunteer_ids, role_id, shift_start, shift_end } = req.body;

    const connection = await getConnection();
    for (const volId of volunteer_ids) {
      await connection.execute(
        `INSERT INTO volunteer_assignment
          (assignment_id, volunteer_id, event_id, role_id, shift_start, shift_end)
         VALUES (:assignment_id, :volunteer_id, :event_id, :role_id, :shift_start, :shift_end)`,
        {
          assignment_id: "ASSIGN" + Math.floor(100000 + Math.random() * 900000),
          volunteer_id: volId,
          event_id,
          role_id: 1,
          shift_start: shift_start,
          shift_end,
        }
      );
    }

    await connection.commit();
    await connection.close();

    res.status(201).json({ message: "Volunteers assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning volunteers" });
  }
};

export const getCoordinatorShifts = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT e.event_name, e.start_time, e.end_time
       FROM event e
       WHERE e.coordinator_id = :coordinator_id`,
      { coordinator_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();
    res.status(200).json({ shifts: result.rows.map(r => ({
      event_name: r.EVENT_NAME,
      start_time: r.START_TIME,
      end_time: r.END_TIME,
    })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shifts" });
  }
};

export const getVolunteerList = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const { event_id } = req.query; 

    const connection = await getConnection();
    const assignedResult = await connection.execute(
      `SELECT 
         u.user_id, u.first_name, u.last_name, u.email,
         va.shift_start, va.shift_end
       FROM volunteer_assignment va
       JOIN users u ON va.volunteer_id = u.user_id
       WHERE va.event_id = :event_id`,
      { event_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const availableResult = await connection.execute(
      `SELECT u.user_id, u.first_name, u.last_name, u.email
       FROM users u
       WHERE u.role_type = 'VOLUNTEER'
         AND NOT EXISTS (
           SELECT 1 FROM volunteer_assignment va
           WHERE va.volunteer_id = u.user_id AND va.event_id = :event_id
         )`,
      { event_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();
    res.status(200).json({
      assigned: assignedResult.rows.map(r => ({
        user_id: r.USER_ID,
        first_name: r.FIRST_NAME,
        last_name: r.LAST_NAME,
        email: r.EMAIL,
        shift_start: r.SHIFT_START,
        shift_end: r.SHIFT_END,
      })),
      available: availableResult.rows.map(r => ({
        user_id: r.USER_ID,
        first_name: r.FIRST_NAME,
        last_name: r.LAST_NAME,
        email: r.EMAIL,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching volunteers" });
  }
};
