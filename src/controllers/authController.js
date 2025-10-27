import bcrypt from 'bcryptjs';
import { getConnection } from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import crypto from 'crypto';
import oracledb from 'oracledb';

function generateUserId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return 'STUD' + randomNum;
}

function generateLogId() {
  return 'LOG' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

// REGISTER
export async function registerUser(req, res) {
  const { first_name, last_name, email, phone, password, role_type = 'USER' } = req.body; // Default to USER role
  const connection = await getConnection();

  try {
    // 1️⃣ Check for existing email
    const check = await connection.execute(
      `SELECT user_id FROM users WHERE email = :email`,
      [email]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = generateUserId();

    // 3️⃣ Insert into USERS table
    await connection.execute(
      `INSERT INTO USERS (USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD, ROLE_TYPE)
       VALUES (:user_id, :first_name, :last_name, :email, :phone, :password, :role_type)`,
      {
        user_id,
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        role_type, // ✅ Pass to query
      }
    );

    // 4️⃣ Generate JWT token
    const token = generateToken({ user_id, email, role: 'USER' });

    // 5️⃣ Add login record to LOG_HISTORY
    await connection.execute(
      `INSERT INTO log_history (log_id, user_id, action, ip_address)
       VALUES (:log_id, :user_id, :action, :ip_address)`,
      {
        log_id: generateLogId(),
        user_id,
        action: 'LOGIN',
        ip_address: req.ip,
      }
    );

    await connection.commit();

    // 6️⃣ Return success response
    res.status(201).json({
      message: 'User registered & logged in successfully',
      token,
      user: { user_id, first_name, last_name, email, phone, role: 'USER' }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  } finally {
    await connection.close();
  }
}

// LOGIN
export async function loginUser(req, res) {
  const { email, password } = req.body;
  const connection = await getConnection();

  try {
    const result = await connection.execute(
      `SELECT user_id, email, password, role_type, first_name, last_name, phone FROM users WHERE email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }   // ✅ Fix
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const row = result.rows[0];
    const {
      USER_ID: user_id,
      EMAIL: dbEmail,
      PASSWORD: dbPassword,
      ROLE_TYPE: role_type,
      FIRST_NAME: first_name,
      LAST_NAME: last_name,
      PHONE: phone
    } = row;

    console.log('Extracted values:', { user_id, dbEmail, role_type, first_name, last_name });

    const isMatch = await bcrypt.compare(password, dbPassword);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ user_id, email, role: role_type });

    await connection.execute(
      `INSERT INTO log_history (log_id, user_id, action, ip_address)
       VALUES (:log_id, :user_id, :action, :ip_address)`,
      {
        log_id: generateLogId(),
        user_id,
        action: 'LOGIN',
        ip_address: req.ip
      }
    );

    await connection.commit();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { user_id, first_name, last_name, email, phone, role: role_type }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Login failed' });
  } finally {
    await connection.close();
  }
}


// LOGOUT
export async function logoutUser(req, res) {
  const { user_id } = req.user; // user_id comes from decoded JWT
  const connection = await getConnection();

  try {
    await connection.execute(
      `INSERT INTO log_history (log_id, user_id, action, ip_address)
       VALUES (:log_id, :user_id, :action, :ip_address)`,
      {
        log_id: generateLogId(),
        user_id,
        action: 'LOGOUT',
        ip_address: req.ip
      }
    );

    await connection.commit();

    res.status(200).json({
      message: 'User logged out successfully. Token should be cleared on frontend.'
    });
  } catch (err) {
    console.error('Error logging out:', err);
    res.status(500).json({ message: 'Logout failed' });
  } finally {
    await connection.close();
  }
}
