import { getConnection } from "../config/db.js";
import oracledb from 'oracledb';

// 1️⃣ Home: profile + 5 events registered
export const getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await getConnection();

    const userResult = await connection.execute(
      `SELECT user_id, first_name, last_name, email, phone, role_type 
       FROM users WHERE user_id = :user_id`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    if (!userResult.rows.length)
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });

    const user = userResult.rows[0];
    
    res.status(200).json({
      success: true,
      user: {
        user_id: user.USER_ID,
        first_name: user.FIRST_NAME,
        last_name: user.LAST_NAME,
        email: user.EMAIL,
        phone: user.PHONE,
        role: user.ROLE_TYPE
      }
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
      `SELECT e.event_id, e.event_name, e.start_time as event_date, 
              e.venue as event_location, r.registration_type, r.team_name
       FROM registrations r
       JOIN events e ON r.event_id = e.event_id
       WHERE r.user_id = :user_id
       ORDER BY e.start_time DESC`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await connection.close();

    const registrations = result.rows.map(reg => ({
      event_id: reg.EVENT_ID,
      event_name: reg.EVENT_NAME,
      event_date: reg.EVENT_DATE,
      event_location: reg.EVENT_LOCATION,
      registration_type: reg.REGISTRATION_TYPE,
      team_name: reg.TEAM_NAME
    }));

    res.status(200).json({ 
      success: true, 
      registrations 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching user events" 
    });
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
