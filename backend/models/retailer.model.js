const pool = require('../config/db');

const RetailerModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM RETAILER WHERE Email = ?',
      [email]
    );
    return rows[0];
  },

  async create({ name, contact, address, shop_type, gst_no, email, hashedPassword }) {
    const [result] = await pool.query(
      `INSERT INTO RETAILER (Name, Contact, Address, Shop_Type, GST_No, Email, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, contact, address, shop_type, gst_no, email, hashedPassword]
    );
    return result.insertId;
  }
};

module.exports = RetailerModel;