const pool = require('../config/db');

const DistributorModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM DISTRIBUTOR WHERE Email = ?',
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
      `INSERT INTO DISTRIBUTOR
        (Name, Contact, Address, Food_License_Validity, Opening_Time, Closing_Time, Type_of_Shop, GST_No, Email, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, contact, address, food_license_validity, opening_time, closing_time, type_of_shop, gst_no, email, hashedPassword]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT Distributor_ID, Name, Email, Contact, Type_of_Shop, Opening_Time, Closing_Time FROM DISTRIBUTOR'
    );
    return rows;
  }
};

module.exports = DistributorModel;