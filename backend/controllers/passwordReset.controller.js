const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../config/db');
const sendEmail = require('../utils/sendEmail');

const ROLES = {
  distributor: 'DISTRIBUTOR',
  retailer: 'RETAILER',
};

const OTP_TTL_MS = 10 * 60 * 1000; // code is valid for 10 minutes
const MAX_ATTEMPTS = 5;

// key: "role:email" -> { hash, expires, attempts }
// Kept in memory, so pending codes are lost if the server restarts (users just request a new one).
const otpStore = new Map();

const keyFor = (role, email) => `${role}:${String(email).trim().toLowerCase()}`;

// STEP 1: send a 6-digit code to the user's email
exports.forgotPassword = async (req, res) => {
  try {
    const { role, email } = req.body;
    const table = ROLES[role];

    if (!table || !email) {
      return res.status(400).json({ message: 'Role and email are required' });
    }

    const [[user]] = await pool.query(
      `SELECT Name FROM ${table} WHERE Email = ?`,
      [email]
    );

    // Same answer whether or not the email exists, so nobody can probe which emails are registered
    if (user) {
      const otp = String(crypto.randomInt(100000, 1000000));

      otpStore.set(keyFor(role, email), {
        hash: await bcrypt.hash(otp, 8),
        expires: Date.now() + OTP_TTL_MS,
        attempts: 0,
      });

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendEmail(
          email,
          'SmartSupply password reset code',
          `Hi ${user.Name},\n\nYour SmartSupply password reset code is ${otp}.\nIt is valid for 10 minutes. If you did not ask for this, you can ignore this email.`
        );
      } else {
        // Demo fallback when email is not configured yet
        console.log(`[DEV ONLY] Password reset code for ${email}: ${otp}`);
      }
    }

    res.status(200).json({
      message: 'If this email is registered, a 6-digit code has been sent.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Could not send the code. Please try again.' });
  }
};

// STEP 2: check the code and set the new password
exports.resetPassword = async (req, res) => {
  try {
    const { role, email, otp, newPassword } = req.body;
    const table = ROLES[role];

    if (!table || !email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const key = keyFor(role, email);
    const entry = otpStore.get(key);

    if (!entry || Date.now() > entry.expires) {
      otpStore.delete(key);
      return res.status(400).json({ message: 'Code expired or not requested. Please request a new code.' });
    }

    if (entry.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(key);
      return res.status(400).json({ message: 'Too many wrong attempts. Please request a new code.' });
    }

    const isMatch = await bcrypt.compare(String(otp).trim(), entry.hash);
    if (!isMatch) {
      entry.attempts += 1;
      return res.status(400).json({ message: 'Incorrect code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE ${table} SET Password = ? WHERE Email = ?`,
      [hashedPassword, email]
    );

    otpStore.delete(key);
    res.status(200).json({ message: 'Password reset successfully. You can log in now.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};