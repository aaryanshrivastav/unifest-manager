import { getConnection } from '../config/db.js';
import oracledb from 'oracledb';

export async function getEventDetails(req, res) {
  const { event_id } = req.params;

  try {
    const connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
        e.event_id,
        e.event_name,
        e.description,
        TO_CHAR(e.start_time, 'YYYY-MM-DD HH24:MI') AS start_time,
        TO_CHAR(e.end_time, 'YYYY-MM-DD HH24:MI') AS end_time,
        v.name AS venue_name,
        u.first_name AS coordinator_name
      FROM event e
      LEFT JOIN venues v ON e.venue_id = v.venue_id
      LEFT JOIN users u ON e.coordinator_id = u.user_id
      WHERE e.event_id = :event_id
      `,
      [event_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (!result.rows.length)
      return res.status(404).json({ message: 'Event not found' });

    const event = result.rows[0];
    res.status(200).json({
      event_id: event.EVENT_ID,
      event_name: event.EVENT_NAME,
      description: event.DESCRIPTION,
      start_time: event.START_TIME,
      end_time: event.END_TIME,
      venue_name: event.VENUE_NAME,
      coordinator_name: event.COORDINATOR_NAME,
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
