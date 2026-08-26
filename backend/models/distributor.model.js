const pool = require('../config/db');

const DistributorModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM DISTRIBUTOR WHERE Email = ?',
      [email]
    );
    return rows[0];
  },

  async create({ name, contact, address, gst_no, email, hashedPassword }) {
    const [result] = await pool.query(
      `INSERT INTO DISTRIBUTOR (Name, Contact, Address, GST_No, Email, Password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, contact, address, gst_no, email, hashedPassword]
    );
    return result.insertId;
  }
};

module.exports = DistributorModel;