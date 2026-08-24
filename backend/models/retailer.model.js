const pool = require('../config/db');

const RetailerModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM retailer WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async create({ name, contact, address, shop_type, gst_no, email, hashedPassword }) {
    const [result] = await pool.query(
      `INSERT INTO retailer (name, contact, address, shop_type, gst_no, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, contact, address, shop_type, gst_no, email, hashedPassword]
    );
    return result.insertId;
  }
};

module.exports = RetailerModel;