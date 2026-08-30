const pool = require('../config/db');

const StockModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT s.stock_id, s.product_id, p.name AS product_name,
              s.input_quantity, s.output_quantity, s.remaining_quantity,
              s.date, s.expiry
       FROM stock s
       JOIN product p ON s.product_id = p.product_id
       WHERE s.distributor_id = ?
       ORDER BY s.stock_id DESC`,
      [distributorId]
    );
    return rows;
  },

  async create({ distributorId, product_id, input_quantity, date, expiry }) {
    const [result] = await pool.query(
      `INSERT INTO stock (distributor_id, product_id, input_quantity, output_quantity, remaining_quantity, date, expiry)
       VALUES (?, ?, ?, 0, ?, ?, ?)`,
      [distributorId, product_id, input_quantity, input_quantity, date, expiry]
    );
    return result.insertId;
  },

  async update(id, distributorId, { input_quantity, output_quantity, date, expiry }) {
    const remaining_quantity = input_quantity - output_quantity;
    const [result] = await pool.query(
      `UPDATE stock SET input_quantity = ?, output_quantity = ?, remaining_quantity = ?, date = ?, expiry = ?
       WHERE stock_id = ? AND distributor_id = ?`,
      [input_quantity, output_quantity, remaining_quantity, date, expiry, id, distributorId]
    );
    return result.affectedRows;
  },

  async remove(id, distributorId) {
    const [result] = await pool.query(
      'DELETE FROM stock WHERE stock_id = ? AND distributor_id = ?',
      [id, distributorId]
    );
    return result.affectedRows;
  },

  async reduceForDelivery(productId, distributorId, quantity) {
    const [result] = await pool.query(
      `UPDATE stock
       SET output_quantity = output_quantity + ?, remaining_quantity = remaining_quantity - ?
       WHERE product_id = ? AND distributor_id = ?
       ORDER BY stock_id DESC LIMIT 1`,
      [quantity, quantity, productId, distributorId]
    );
    return result.affectedRows;
  },
};

module.exports = StockModel;