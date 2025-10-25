import { getConnection } from "../config/db.js";

// 1️⃣ Home: profile + 5 events under them
export const getCoordinatorHome = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, name, email, role FROM users WHERE user_id = :coordinator_id`,
      { coordinator_id }
    );

    const eventsResult = await connection.execute(
      `SELECT e.event_id, e.event_name, e.start_time
       FROM events e
       WHERE e.coordinator_id = :coordinator_id
       FETCH FIRST 5 ROWS ONLY`,
      { coordinator_id }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ message: "Coordinator not found" });

    const [userId, name, email, role] = userResult.rows[0];

    res.status(200).json({
      coordinator: { user_id: userId, name, email, role },
      events: eventsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching home data" });
  }
};

// 2️⃣ Assign volunteers to an event
export const assignVolunteers = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const { event_id, volunteer_ids, role_id, shift_start, shift_end } = req.body;

    const connection = await getConnection();

    // Assign each volunteer
    for (const volId of volunteer_ids) {
      await connection.execute(
        `INSERT INTO volunteer_assignment
          (assignment_id, volunteer_id, event_id, role_id, shoft_start, shift_end)
         VALUES (:assignment_id, :volunteer_id, :event_id, :role_id, :shift_start, :shift_end)`,
        {
          assignment_id: "ASSIGN" + Math.floor(100000 + Math.random() * 900000),
          volunteer_id: volId,
          event_id,
          role_id,
          shoft_start: shift_start,
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

// 3️⃣ Shifts for coordinator
export const getCoordinatorShifts = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT e.event_name, e.start_time, e.end_time
       FROM events e
       WHERE e.coordinator_id = :coordinator_id`,
      { coordinator_id }
    );

    await connection.close();
    res.status(200).json({ shifts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shifts" });
  }
};

// 4️⃣ List volunteers for a selected event
export const getVolunteerList = async (req, res) => {
  try {
    const { coordinator_id } = req.params;
    const { event_id } = req.query; // select event via dropdown

    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT u.user_id, u.name, u.email, va.shoft_start, va.shift_end
       FROM volunteer_assignment va
       JOIN users u ON va.volunteer_id = u.user_id
       JOIN events e ON va.event_id = e.event_id
       WHERE e.coordinator_id = :coordinator_id AND va.event_id = :event_id`,
      { coordinator_id, event_id }
    );

    await connection.close();
    res.status(200).json({ volunteers: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching volunteers" });
  }
};
