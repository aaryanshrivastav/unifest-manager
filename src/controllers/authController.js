const bcrypt = require('bcryptjs');
const { getConnection } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const crypto = require('crypto');

function generateUserId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return 'STUD' + randomNum;
}

function generateLogId() {
  return 'LOG' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

// REGISTER (signup + auto-login)
async function registerUser(req, res) {
  const { first_name, last_name, email, phone, password } = req.body;
  const connection = await getConnection();

  try {
    // check if email already exists
    const check = await connection.execute(
      `SELECT user_id FROM users WHERE email = :email`,
      [email]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = generateUserId();

    await connection.execute(
      `INSERT INTO users (user_id, first_name, last_name, email, phone, password, role_id, created_date)
       VALUES (:user_id, :first_name, :last_name, :email, :phone, :password, :role_id, SYSDATE)`,
      {
        user_id,
        first_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        role_id: 'ROLE_USER'
      }
    );

    // Generate JWT token for the new user
    const token = generateToken({ user_id, email, role: 'user' });

    // Record auto-login in log_history
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

    res.status(201).json({
      message: 'User registered successfully. Logged in automatically.',
      token,
      user: {
        user_id,
        first_name,
        last_name,
        email,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('❌ Error registering user:', err);
    res.status(500).json({ message: 'Registration failed' });
  } finally {
    await connection.close();
  }
}

// LOGIN
async function loginUser(req, res) {
  const { email, password } = req.body;
  const connection = await getConnection();

  try {
    const result = await connection.execute(
      `SELECT user_id, email, password, role_id, first_name, last_name FROM users WHERE email = :email`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [user_id, dbEmail, dbPassword, role_id, first_name, last_name] = result.rows[0];
    const isMatch = await bcrypt.compare(password, dbPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ user_id, email, role_id });

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
      user: {
        user_id,
        first_name,
        last_name,
        email,
        role: role_id
      }
    });
  } catch (err) {
    console.error('❌ Error logging in:', err);
    res.status(500).json({ message: 'Login failed' });
  } finally {
    await connection.close();
  }
}

module.exports = { registerUser, loginUser };
