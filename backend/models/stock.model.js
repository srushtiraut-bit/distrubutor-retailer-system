const pool = require('../config/db');

const StockModel = {
  async findAllByDistributor(distributorId) {
    const [rows] = await pool.query(
      `SELECT s.Stock_ID AS id,
              s.Stock_ID AS stock_id,
              s.Product_ID AS product_id,
              p.Name AS product_name,
              s.Input_Quantity AS input_quantity,
              s.Output_Quantity AS output_quantity,
              s.Remaining_Quantity AS remaining_quantity,
              DATE_FORMAT(s.Date, '%Y-%m-%d') AS date,
              DATE_FORMAT(s.Expiry, '%Y-%m-%d') AS expiry
       FROM STOCK s
       JOIN PRODUCT p ON s.Product_ID = p.Product_ID
       WHERE s.Distributor_ID = ?
       ORDER BY s.Stock_ID DESC`,
      [distributorId]
    );
    return rows;
  },

  async create({ distributorId, product_id, input_quantity, date, expiry }) {
    const [result] = await pool.query(
      `INSERT INTO STOCK (Distributor_ID, Product_ID, Input_Quantity, Output_Quantity, Remaining_Quantity, Date, Expiry)
       VALUES (?, ?, ?, 0, ?, ?, ?)`,
      [distributorId, product_id, input_quantity, input_quantity, date, expiry]
    );
    return result.insertId;
  },

  async update(id, distributorId, { input_quantity, output_quantity, date, expiry }) {
    const remaining_quantity = input_quantity - output_quantity;
    const [result] = await pool.query(
      `UPDATE STOCK SET Input_Quantity = ?, Output_Quantity = ?, Remaining_Quantity = ?, Date = ?, Expiry = ?
       WHERE Stock_ID = ? AND Distributor_ID = ?`,
      [input_quantity, output_quantity, remaining_quantity, date, expiry, id, distributorId]
    );
    return result.affectedRows;
  },

  async remove(id, distributorId) {
    const [result] = await pool.query(
      'DELETE FROM STOCK WHERE Stock_ID = ? AND Distributor_ID = ?',
      [id, distributorId]
    );
    return result.affectedRows;
  },

  async reduceForDelivery(productId, distributorId, quantity) {
    const [result] = await pool.query(
      `UPDATE STOCK
       SET Output_Quantity = Output_Quantity + ?, Remaining_Quantity = Remaining_Quantity - ?
       WHERE Product_ID = ? AND Distributor_ID = ?
       ORDER BY Stock_ID DESC LIMIT 1`,
      [quantity, quantity, productId, distributorId]
    );
    return result.affectedRows;
  },
};

module.exports = StockModel;