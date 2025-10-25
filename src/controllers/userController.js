import { getConnection } from "../config/db.js";

// 1️⃣ Home: profile + 5 events registered
export const getHome = async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, name, email, role 
       FROM users WHERE user_id = :user_id`,
      { user_id }
    );

    const eventsResult = await connection.execute(
      `SELECT e.event_id, e.event_name, e.start_time 
       FROM registrations r
       JOIN events e ON r.event_id = e.event_id
       WHERE r.user_id = :user_id
       FETCH FIRST 5 ROWS ONLY`,
      { user_id }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ message: "User not found" });

    const [userId, name, email, role] = userResult.rows[0];

    res.status(200).json({
      user: { user_id: userId, name, email, role },
      events: eventsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching home data" });
  }
};

// 2️⃣ All Events
export const getAllEvents = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(`SELECT * FROM events`);
    await connection.close();

    res.status(200).json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// 3️⃣ My Events
export const getMyEvents = async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await getConnection();

    const result = await connection.execute(
      `SELECT e.event_id, e.event_name, e.start_time 
       FROM registrations r
       JOIN events e ON r.event_id = e.event_id
       WHERE r.user_id = :user_id`,
      { user_id }
    );

    await connection.close();

    res.status(200).json({ events: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user events" });
  }
};

// 4️⃣ Volunteer Application
export const submitApplication = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { role_id, description } = req.body;

    const connection = await getConnection();

    const applicationId = "APP" + Math.floor(100000 + Math.random() * 900000);

    await connection.execute(
      `INSERT INTO volunteer_application 
        (application_id, user_id, role_id, description)
       VALUES (:application_id, :user_id, :role_id, :description)`,
      { application_id: applicationId, user_id, role_id, description }
    );

    await connection.commit();
    await connection.close();

    res.status(201).json({
      message: "Volunteer application submitted",
      application_id: applicationId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting application" });
  }
};
