const pool = require('../config/db');

const ProductModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT Product_ID AS id,
              Product_ID AS product_id,
              Name AS name,
              Cost_Price AS cost_price,
              Selling_Price AS selling_price,
              Category AS category,
              Unit AS unit
       FROM PRODUCT
       WHERE Distributor_ID = ?
       ORDER BY Product_ID DESC`,
      [distributorId]
    );
    return rows;
  },

  async create({ distributorId, name, cost_price, selling_price, category, unit }) {
    const [result] = await pool.query(
      `INSERT INTO PRODUCT (Distributor_ID, Name, Cost_Price, Selling_Price, Category, Unit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [distributorId, name, cost_price, selling_price, category, unit]
    );
    return result.insertId;
  },

  async update(id, distributorId, { name, cost_price, selling_price, category, unit }) {
    const [result] = await pool.query(
      `UPDATE PRODUCT
       SET Name = ?, Cost_Price = ?, Selling_Price = ?, Category = ?, Unit = ?
       WHERE Product_ID = ? AND Distributor_ID = ?`,
      [name, cost_price, selling_price, category, unit, id, distributorId]
    );
    return result.affectedRows;
  },

  async remove(id, distributorId) {
    const [result] = await pool.query(
      'DELETE FROM PRODUCT WHERE Product_ID = ? AND Distributor_ID = ?',
      [id, distributorId]
    );
    return result.affectedRows;
  },
};

module.exports = ProductModel;