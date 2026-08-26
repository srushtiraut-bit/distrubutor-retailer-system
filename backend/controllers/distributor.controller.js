const pool = require('../config/db');

exports.getAllDistributors = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT Distributor_ID, Name, Contact, Address, Type_of_Shop FROM DISTRIBUTOR'
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};