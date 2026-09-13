const pool = require('../config/db');

const DistributorModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM distributor WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async create({
    name,
    contact,
    address,
    gst_no,
    food_license_validity,
    opening_time,
    closing_time,
    type_of_shop,
    email,
    hashedPassword
  }) {
    const [result] = await pool.query(
      `INSERT INTO distributor 
        (name, contact, address, food_license_validity, opening_time, closing_time, type_of_shop, gst_no, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, contact, address, food_license_validity, opening_time, closing_time, type_of_shop, gst_no, email, hashedPassword]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT distributor_id, name, email, contact, type_of_shop, opening_time, closing_time FROM distributor'
    );
    return rows;
  }
};

module.exports = DistributorModel;