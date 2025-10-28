import { getConnection } from '../config/db.js';

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
        TO_CHAR(e.event_date, 'YYYY-MM-DD') AS event_date,
        v.venue_name,
        e.category,
        u.name AS coordinator_name
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.venue_id
      LEFT JOIN users u ON e.coordinator_id = u.user_id
      WHERE e.event_id = :event_id
      `,
      [event_id]
    );

    await connection.close();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = result.rows[0];
    const eventData = {
      event_id: event[0],
      event_name: event[1],
      description: event[2],
      event_date: event[3],
      venue_name: event[4],
      category: event[5],
      coordinator_name: event[6]
    };

    res.status(200).json(eventData);
  } catch (err) {
    console.error('Error fetching event details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
