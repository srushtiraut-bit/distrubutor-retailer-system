const pool = require('../config/db');

const ProductModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      'SELECT product_id, name, cost_price, selling_price, category, unit FROM product WHERE distributor_id = ? ORDER BY product_id DESC',
      [distributorId]
    );
    return rows;
  },

  async create({ distributorId, name, cost_price, selling_price, category, unit }) {
    const [result] = await pool.query(
      `INSERT INTO product (distributor_id, name, cost_price, selling_price, category, unit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [distributorId, name, cost_price, selling_price, category, unit]
    );
    return result.insertId;
  },

  async update(id, distributorId, { name, cost_price, selling_price, category, unit }) {
    const [result] = await pool.query(
      `UPDATE product SET name = ?, cost_price = ?, selling_price = ?, category = ?, unit = ?
       WHERE product_id = ? AND distributor_id = ?`,
      [name, cost_price, selling_price, category, unit, id, distributorId]
    );
    return result.affectedRows;
  },

  async remove(id, distributorId) {
    const [result] = await pool.query(
      'DELETE FROM product WHERE product_id = ? AND distributor_id = ?',
      [id, distributorId]
    );
    return result.affectedRows;
  },
};

module.exports = ProductModel;